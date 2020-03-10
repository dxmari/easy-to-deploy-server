const prompts = require('prompts');

const { encryptKey } = require('../utils/common')

const questions = [
    {
        type: 'text',
        name: 'username',
        message: 'Enter the username:',
        initial: 'super_admin'
    },
    {
        type: 'text',
        name: 'email',
        message: 'Enter the email address(optional):',
        validate: name => {
            if (name) {
                return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(name).toLowerCase()) ? true : 'Enter a valid email address';
            }
            return true;
        }
    },
    {
        type: 'password',
        name: 'password',
        message: 'Enter the password:',
        validate: name => (name && name.length > 5) ? true : "Password must have 6 characters or above"
    }
];

exports.getUserInputs = (args) => {
    return new Promise(async resolve => {
        const response = await prompts(questions);
        if (response.password) {
            response.password = encryptKey(response.password);
        }
        resolve(response);
    })
};