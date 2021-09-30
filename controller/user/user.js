const User = require("../../model/userModel");
const alert = require("../../utils/alert");


const USER = {};


USER.createUser = async (req, res) => {

    const user = new User(req.body);

    try {

        const op = "create";
        await alert(user.email, op);

        await user.save();

        const token = await user.generateToken();

        res.send({ user, token });

    } catch (e) {
        res.status(500).send(e);
    }

}


USER.logIn = async (req, res) => {

    const { email, password } = req.body;

    try {


        const user = await User.findByCredentials(email, password);

        const token = await user.generateToken();


        res.send({ user, token });
    } catch (e) {
        res.status(500).send(e);
    }
}


USER.logout = async (req, res) => {
    const Token = req.token;
    const user = req.user;
    try {
        user.tokens = user.tokens.filter((token) => {
            return token.token !== Token;
        });

        await user.save();

        res.send(user);

    } catch (e) {
        res.status(500).send(e);
    }
}

USER.logoutAll = async (req, res) => {
    const user = req.user;

    try {
        user.tokens = [];

        await user.save();

        res.send(user);

    } catch (e) {
        res.status(500).send();
    }
}

USER.getUserById = async (req, res) => {
    const { id } = req.body;

    try {
        const user = await User.findById(id);

        res.send(user);
    } catch (e) {
        res.status(404).send(e);
    }
}

USER.myProfile = async (req, res) => {

    try {
        const user = req.user;

        res.send(user);
    } catch (e) {
        res.status(404).send(e);
    }
}

USER.getAllUsers = async (req, res) => {

    let limit = 0;
    const sort = {};
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');


        sort[parts[0]] = parts[1] == 'desc' ? -1 : 1;
    }
    if (req.query.limit) {
        limit = parseInt(req.query.limit)
    }


    try {
        const users = await User.find({}).sort(sort).limit(limit);


        res.send(users);
    } catch (e) {
        res.status(404).send(e);

    }
}

USER.update = async (req, res) => {
    const updates = Object.keys(req.body);

    const restrictUpdates = ['_id', 'userName', 'token', 'tokens'];

    const isValid = updates.every((update) => restrictUpdates.includes(update));

    if (isValid) {
        return res.status(403).send('restricted updates')
    }

    try {
        const user = await User.findById(req._id);

        updates.forEach((update) => user[update] = req.body[update]);




        await user.save();

        res.send(user);

    } catch (e) {
        res.status(400).send(e);
    }
}

USER.deleteUser = async (req, res) => {

    console.log(req.params.id);

    try {



        const user = await User.findOneAndDelete({ _id: req.params.id });
        console.log(user);

        if (!user) {
            return res.status(404).send('user not found');
        }
        const cart = await User.removeCart(user);

        if (!cart) {
            return res.status(404).send('cart not deleted')
        }


        const op = "delete";
        await alert(user.email, op);

        res.send(user);
    } catch (e) {
        res.status(500).send(e)

    }
}


module.exports = USER;