const reminderEmailContent = (participantName, eventTitle, eventDate, eventLocation, eventOrganizer) => {
    return (
        `<div>
        <h1>Hi ${participantName}</h1>
        <p>
            This is a friendly reminder that you have a reservation to attend an upcoming event <b>${eventTitle}</b> at <b>${eventLocation}</b>.
        </p>
        <div>
            <div>WHAT: <b> ${eventTitle} </b></div>
            <div>WHEN: <b> ${eventDate} </b></div>
            <div>WHERE:<b> ${eventLocation} </b></div>
        </div>
        <p>
            Click HERE for directions. Please contact the event's orgonizer <b>${eventOrganizer}</b> if you have any questions.
        </p>
        <b>
            Best <i> ${eventOrganizer} </i>
        </b>
    </div>`
    )
}

module.exports = reminderEmailContent;