const usersStorage = require("../storages/usersStorage");
const { body, validationResult } = require("express-validator");

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 10 characters";

const validateUser = [
  body("firstName")
    .trim()
    .isAlpha()
    .withMessage(`first name ${alphaErr}`)
    .isLength({ min: 1, max: 10 })
    .withMessage(`first name ${lengthErr}`),

  body("lastName")
    .trim()
    .isAlpha()
    .withMessage(`last name ${alphaErr}`)
    .isLength({ min: 1, max: 10 })
    .withMessage(`last name ${lengthErr}`),

  body("email")
    .trim()
    .isEmail()
    .withMessage("email field should contain an email address"),

  body("age")
    .optional({ values: "falsy" })
    .trim()
    .isNumeric()
    .withMessage("age should be a number")
    .isInt({ min: 18, max: 120 })
    .withMessage("age should be between 18 to 120"),

  body("bio")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("bio should not be longer than 200 characters"),
];

exports.usersListGet = (req, res) => {
  res.render("index", {
    title: "User list",
    users: usersStorage.getUsers(),
  });
};

exports.usersCreateGet = (req, res) => {
  res.render("createUser", {
    title: "Create user",
  });
};

exports.usersCreatePost = [
  validateUser,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("createUser", {
        title: "create user",
        errors: errors.array(),
      });
    }

    const { firstName, lastName, email, age, bio } = req.body;
    usersStorage.addUser({ firstName, lastName, email, age, bio });
    res.redirect("/");
  },
];

exports.usersUpdateGet = (req, res) => {
  const user = usersStorage.getUser(req.params.id);
  res.render("updateUser", {
    title: "Update user",
    user: user,
  });
};

exports.usersUpdatePost = [
  validateUser,
  (req, res) => {
    const user = usersStorage.getUser(req.params.id);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("updateUser", {
        title: "Update user",
        user: user,
        errors: errors.array(),
      });
    }
    const { firstName, lastName, email, age, bio } = req.body;
    usersStorage.updateUser(req.params.id, {
      firstName,
      lastName,
      email,
      age,
      bio,
    });
    res.redirect("/");
  },
];

exports.usersDeletePost = (req, res) => {
  usersStorage.deleteuser(req.params.id);
  res.redirect("/");
};
