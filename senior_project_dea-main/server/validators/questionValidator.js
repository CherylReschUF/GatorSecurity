//Used express-validatoras an express.js middleware for verifying requests contain correct information meeting formatting requirements
const { body, check, validationResult } = require('express-validator')

//Validate Learn question requests
exports.validateQuestion = [
    body('question').notEmpty().withMessage("Question cannot be empty"),
    body('type').notEmpty().withMessage("Type cannot be empty"),
    body('topic').notEmpty().withMessage("Topic cannot be empty"),
    body('answer').notEmpty().withMessage("Answer cannot be empty"),
    body('displayType').notEmpty().withMessage("Display type cannot be empty"),
    body('options').custom((value, {req}) => {
        if ((value.length-1) !== 0 && !value.includes(req.body.answer))
        {
            throw new Error("The correct answer must be present in the answer options")
        } else {
            return value
        }
    }).optional({ checkFalsy: true }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
          return res.status(422).json({errors: errors.array()});
        next();
    },
];

//Validate CYOA question requests
exports.validateCYOAQuestion = [
    body('parentQuestionId').notEmpty().withMessage("A parent question is required"),
    body('questionNumber').notEmpty().withMessage("A question number is required"),
    body('question').notEmpty().withMessage("A question is required"),
    body('type').notEmpty().withMessage("A type is required"),
    body('options').notEmpty().withMessage("Options are required"),
    body('answer').notEmpty().withMessage("An answer is required"),
    check('files').custom((value, {req}) => {
        if(value.length !== 1) {
            throw new Error("Exactly one image file must be uploaded.")
        }
        else {
            const dotIndex = value[0].indexOf(".")
            
            if(dotIndex === -1) {
                throw new Error("The image file must have an extension.")
            }

            const subs = value[0].substring(dotIndex + 1)
            if(subs !== "png" && subs !== "jpg" && subs !== "jpeg" && subs !== "apng" && subs !== "avif" && subs !== "gif" && subs !== "svg" && subs !== "webp") {
                throw new Error("The uploaded file must be an image file.")
            }

            return value
        }
    }).optional({ checkFalsy: true }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
          return res.status(422).json({errors: errors.array()});
        next();
    },
];

//Validate DND question requests
exports.validateDNDQuestion = [
    body('parentQuestionId').notEmpty().withMessage("A parent question is required"),
    body('question').notEmpty().withMessage("A question is required"),
    body('answer').notEmpty().withMessage("An answer array is required"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
          return res.status(422).json({errors: errors.array()});
        next();
    }
];

//Validate matching question requests
exports.validateMatchingQuestion = [
    body('parentQuestionId').notEmpty().withMessage("A parent question is required"),
    body('content').notEmpty().withMessage("A content map is required"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
          return res.status(422).json({errors: errors.array()});
        next();
    }
];