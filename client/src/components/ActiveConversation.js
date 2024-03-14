import React from 'react';

const ActiveConversation = function(props) {

    const friend = props.friend;
    const message = props.conversation.message;
    const timestamp = props.conversation.timestamp;

    const trimmedMessage = (data) => {

        if (data.length > 20) {

            return data.substring(0,20) + "...";


        } else {

            return data;

        }

    }

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const convertDate = (date) => {

        date = new Date(date);

        const ampm = date.getHours() >= 12 ? 'pm' : 'am';

        const hours = (date.getHours() % 12) === 0 ? 12 : (date.getHours() % 12);

        const minutes = ("0" + date.getMinutes()).slice(-2);

        let time = hours + ":" + minutes + " " + ampm;

        if (date.setHours(0,0,0,0) !== new Date().setHours(0,0,0,0)) {

            const month = months[date.getMonth()];

            const day = date.getDate();

            const year = date.getFullYear();

            if (year !== new Date().getFullYear()) {

                time = month + " " + day + ", " + year;

            } else {

                time = month + " " + day;

            }

        }

        return time;

    }

    return (

        <div className="message-box">

            <div className="message-info">

                <p className="message-friend">{friend}</p>

                {props.unread &&      

                    <div className="message-circle">
                        <p className="message-new">{props.unread}</p>
                    </div>
                
                ||  <div className="message-no-circle">
                        <p className="message-new">{props.unread}</p>
                    </div>
                    
                }

            </div>

            <div className="message-line">
                <p className="message-content">{trimmedMessage(message)}</p>
                <p className="message-timestamp">{convertDate(timestamp)}</p>
            </div>

        </div>

    );
}

export default ActiveConversation;