const Message = require('../models/Message');
const User = require('../models/User');
const Chat = require('../models/Chat');

const sendMessage = async (req, res) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }

    var newMessage = {
        senderId: req.user._id,
        text: content,
        chatId: chatId,
    };

    try {
        var message = await Message.create(newMessage);

        message = await message.populate("senderId", "name email");
        message = await message.populate("chatId");
        message = await User.populate(message, {
            path: "chatId.participants",
            select: "name email",
        });

        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message,
        });

        res.json(message);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};

const allMessages = async (req, res) => {
    try {
        const messages = await Message.find({ chatId: req.params.chatId })
            .populate("senderId", "name email")
            .populate("chatId");

        res.json(messages);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};

module.exports = { sendMessage, allMessages };
