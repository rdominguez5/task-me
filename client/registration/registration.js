/*
===============================
=           Created           =
===============================
*/

Template.registerUser.created = function() {

};

/*
===============================
=            Forms            =
===============================
*/

AutoForm.hooks({
    createUserForm: {

        before: {
            registerUser: function(doc, template) {
                var skills = doc.skills;
                if (skills) {
                    skills.forEach(function(part, index, skills) {
                        skills[index] = skills[index].toLowerCase();
                    });
                    doc.skills = skills;
                }
                return doc;
            }
        },

        after: {
            registerUser: function(error, result, template) {
                if (!error) {
                    Meteor.loginWithPassword(result.username, result.password, function(error) {
                        if (!error) {
                            alertify.success('Has registrado tu usuario');
                            Router.go('dashboard');
                        }
                    });
                }
            }
        },
        onError: function(operation, error, template) {
            if (error.reason && error.reason === 'Email already exists.') {
                AutoForm.getValidationContext('createUserForm').addInvalidKeys([{
                    name: 'email',
                    type: 'unique'
                }]);
            } else if (error.reason && error.reason === 'Username already exists.') {
                AutoForm.getValidationContext('createUserForm').addInvalidKeys([{
                    name: 'username',
                    type: 'unique'
                }]);
            }
        }

    }
});

/*
===============================
=           Helpers           =
===============================
*/

Template.registerUser.helpers({
    createUserSchema: function() {
        return Schema.createUser;
    }
});

/*
===============================
=           Events            =
===============================
*/
