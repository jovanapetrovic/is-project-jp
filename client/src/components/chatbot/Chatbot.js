import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios/index';
import Cookies from 'universal-cookie';
import { v4 as uuid } from 'uuid';

import Message from './Message';
import Card from './Card';
import QuickReplies from './QuickReplies';

const cookies = new Cookies();

class Chatbot extends Component {

	lastMessage;
	talkInput;

	constructor(props) {
		super(props);

		this.state = {
			messages: [],
			showBot: true,
			bookshopWelcomeSent: false
		}

		this._handleInputKeyPress = this._handleInputKeyPress.bind(this);
		this._handleQuickReplyPayload = this._handleQuickReplyPayload.bind(this);

		this.hide = this.hide.bind(this);
        this.show = this.show.bind(this);

		if (cookies.get('userId') === undefined) {
			cookies.set('userId', uuid(), { path: '/'});
		}
	}

	async dialogflow_text_query(queryText) {
		let speaks = {
			speaker: "me",
			message: {
				text: {
					text: queryText
				}
			}
		};
		this.setState({
			messages: [...this.state.messages, speaks]
		});

		try {
			const res = await axios.post('api/dialogflow/text_query', {text: queryText, userId: cookies.get('userId')});

			for (let message of res.data.fulfillmentMessages) {
				speaks = {
					speaker: 'bot',
					message: message
				}
				this.setState({ messages: [...this.state.messages, speaks]});
			}
		} catch(e) {
			speaks = {
                speaks: 'bot',
                message: {
                    text : {
                        text: "I'm having troubles to connect to DialogFlow and need to terminate. Please, try again later."
                    }
                }
            }
            this.setState({ messages: [...this.state.messages, speaks]});

            let that = this;
            setTimeout(function() {
                that.setState({ showBot: false })
            }, 2000);
		}

	}

	async dialogflow_event_query(eventName) {
		let speaks = {};
		try {
			const res = await axios.post('api/dialogflow/event_query', {event: eventName, userId: cookies.get('userId')});
			
			if (res.data) {

				for (let message of res.data.fulfillmentMessages) {
					speaks = {
						speaker: 'bot',
						message: message
					}
					this.setState({ messages: [...this.state.messages, speaks]});
				}
			}
		} catch(e) {
			speaks = {
                speaks: 'bot',
                message: {
                    text : {
                        text: "I'm having troubles to connect to DialogFlow and need to terminate. Please, try again later."
                    }
                }
            }
            this.setState({ messages: [...this.state.messages, speaks]});

            let that = this;
            setTimeout(function() {
                that.setState({ showBot: false })
            }, 2000);
		}
	}

	resolveAfterXSeconds(x) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(x);
            }, x * 1000);
        })
    }

	async componentDidMount() {
		this.dialogflow_event_query('Welcome');

		if (window.location.pathname === '/shop' && !this.state.bookshopWelcomeSent) {
			await this.resolveAfterXSeconds(1);
            this.dialogflow_event_query('WELCOME_TO_BOOKSHOP');
            this.setState({ bookshopWelcomeSent: true, showBot: true });
        }

        this.props.history.listen(() => {
            if (this.props.history.location.pathname === '/shop' && !this.state.bookshopWelcomeSent) {
                this.dialogflow_event_query('WELCOME_TO_BOOKSHOP');
                this.setState({ bookshopWelcomeSent: true, showBot: true });
            }
        });
	}

	componentDidUpdate() {
		this.lastMessage.scrollIntoView({ behaviour: "smooth"});
		if ( this.talkInput ) {
            this.talkInput.focus();
        }
	}

	show(e) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({ showBot: true });
    }

    hide(e) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({ showBot: false });
    }

	_handleQuickReplyPayload(event, payload, text) {
        event.preventDefault();
        event.stopPropagation();

        console.log(payload);

        switch (payload) {
        	case 'recommend_yes':
                this.dialogflow_event_query('SHOW_BOOK_RECOMMENDATIONS');
                break;
            case 'newsletter_bookclub':
                this.dialogflow_event_query('BOOKCLUB');
                break;
            case 'contact_nis':
                this.dialogflow_event_query('CONTACT_NIS');
                break;
            case 'contact_belgrade':
                this.dialogflow_event_query('CONTACT_BELGRADE');
                break;
            default:
                this.dialogflow_text_query(text);
                break;
        }
    }

	renderCards(cards) {
		return cards.map((card, i) => <Card key={i} payload={card.structValue}/>);
	}

	renderSingleMessage(msg, i) {
		if (msg.message && msg.message.text && msg.message.text.text)  {
			return <Message key={i} speaker={msg.speaker} text={msg.message.text.text}/>;
		} 
		else if (msg.message && msg.message.payload && msg.message.payload.fields && msg.message.payload.fields.cards) {
			return <div key={i}>
                <div className="card-panel grey lighten-5 z-depth-1">
                    <div style={{overflow: 'hidden'}}>
                        <div className="col s2">
                            <a href="/" className="btn-floating btn-large waves-effect waves-light indigo accent-3">{msg.speaker}</a>
                        </div>
                        <div style={{ overflow: 'auto', overflowY: 'scroll'}}>
                            <div style={{ height: 300, width: msg.message.payload.fields.cards.listValue.values.length * 270}}>
                                {this.renderCards(msg.message.payload.fields.cards.listValue.values)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
		} 
		else if (msg.message && msg.message.payload && msg.message.payload.fields && msg.message.payload.fields.quick_replies) {
            return <QuickReplies
                text={msg.message.payload.fields.text ? msg.message.payload.fields.text : null}
                key={i}
                replyClick={this._handleQuickReplyPayload}
                speaker={msg.speaker}
                payload={msg.message.payload.fields.quick_replies.listValue.values}/>;
        }
	}

	renderMessages(messagesFromState) {
		if (messagesFromState) {
            return messagesFromState.map((message, i) => {
                return this.renderSingleMessage(message, i);
            }
        )
        } else {
            return null;
        }
	}

	_handleInputKeyPress(e) {
		if (e.key === 'Enter') {
			this.dialogflow_text_query(e.target.value);
			e.target.value = '';
		}
	}

	render() {
		if (this.state.showBot) {
        	return (
	            <div style={{ minHeight: 500, maxHeight: 470, width: 400, position: 'fixed', bottom: 0, right: 0, border: '1px solid lightgray'}}>
	                <nav>
	                    <div className="nav-wrapper indigo accent-3">
	                        <a href="/" className="brand-logo" style={{ marginLeft: 15}}><i className="material-icons left">chat</i>ChatBot</a>
	                        <ul id="nav-mobile" className="right hide-on-med-and-down">
                                <li><a href="/" onClick={this.hide}>Hide</a></li>
                            </ul>
	                    </div>
	                </nav>
	                <div id="chatbot" style={{ minHeight: 388, maxHeight: 388, width:'100%', overflow: 'auto', backgroundColor: 'white'}}>
	                    {this.renderMessages(this.state.messages)}
	                    <div ref={(el) => { this.lastMessage = el; }} style={{ float:"left", clear: "both" }}/>
	                </div>
	                <div className="col s12" >
	                   <input style={{margin: 0, paddingLeft: '1%', paddingRight: '1%', width: '98%', backgroundColor: 'white'}} placeholder="Type your message here"
	                   		ref={(input) => { this.talkInput = input; }}  
	                   		onKeyPress={this._handleInputKeyPress} type="text" />
					</div>
	            </div>
	        );
    	} else {
    		return (
	            <div style={{ minHeight: 40, maxHeight: 500, width: 400, position: 'fixed', bottom: 0, right: 0, border: '1px solid lightgray'}}>
                    <nav>
                        <div className="nav-wrapper indigo accent-3">
                            <a href="/" className="brand-logo" style={{ marginLeft: 15}}><i className="material-icons left">chat</i>ChatBot</a>
                            <ul id="nav-mobile" className="right hide-on-med-and-down">
                                <li><a href="/" onClick={this.show}>Show</a></li>
                            </ul>
                        </div>
                    </nav>
                    <div ref={(el) => { this.lastMessage = el; }} style={{ float:"left", clear: "both" }}/>
	            </div>
	        );
    	}
    }
}

export default withRouter(Chatbot);