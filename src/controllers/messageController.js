export default class MessageController {
  constructor(key) {
    this.key = key;
    this.messages = this.getMessages();
  }

  getMessages() {
    const storedMessages = localStorage.getItem(this.key);
    return storedMessages ? JSON.parse(storedMessages) : [];
  }

  saveMessages(messages) {
    localStorage.setItem(this.key, JSON.stringify(messages));
  }
  createMessage(newMessage) {
    const date = new Date().toISOString();
    const newMessageWithIndex = {
      ...newMessage,
      index: this.messages.length,
      date,
    };
    this.messages = [...this.messages, newMessageWithIndex];
    this.saveMessages(this.messages);
  }

  updateMessage(index, updatedMessage) {
    if (index >= 0 && index < this.messages.length) {
      const date = new Date().toISOString();
      this.messages = this.messages.map((message, i) =>
        i === index ? { ...message, ...updatedMessage, date } : message
      );
      this.saveMessages(this.messages);
    } else {
      console.error("Message index out of bounds.");
    }
  }

  deleteMessage(index) {
    if (index >= 0 && index < this.messages.length) {
      this.messages = this.messages.filter((_, i) => i !== index);
      this.saveMessages(this.messages);
    } else {
      console.error("Message index out of bounds.");
    }
  }

  getMessagesList() {
    return this.messages;
  }
}
