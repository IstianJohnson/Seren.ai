document.getElementById('send-btn').addEventListener('click', sendMessage);

// Allow sending the message with the Enter key
document.getElementById('user-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    // Get user input
    let userInput = document.getElementById('user-input').value;
    if (userInput === "") return;  // Don't send if input is empty

    // Display user message in the chatbox
    let chatBox = document.getElementById('chat-box');
    let userMessage = document.createElement('div');
    userMessage.className = 'message user-message';
    
    // Set the text and style for "You"
    userMessage.innerHTML = `<span class="user-name">You:</span> ${userInput}`; 
    chatBox.appendChild(userMessage);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the latest message

    // Send the message to the Flask backend using Fetch API
    fetch('/send-message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userInput })
    })
    .then(response => response.json())
    .then(data => {
        // Display the chatbot's response in the chatbox
        let botMessage = document.createElement('div');
        botMessage.className = 'message bot-message';
        
        // Set the text and style for "Seren"
        botMessage.innerHTML = `<span class="bot-name">Seren:</span> ${data.reply}`;
        chatBox.appendChild(botMessage);
        chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the latest message
        
        // Check if refresh is needed
        if (data.refresh) {
            setTimeout(() => {
                location.reload(); // Refresh the page after a short delay
            }, 1000); // Adjust the delay as needed (in milliseconds)
        }
    });

    // Clear the input field
    document.getElementById('user-input').value = "";
}
