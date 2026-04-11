const Password_Rules = [ 
    {
        test: (pw) => pw.length >= 8 && pw.length <= 16,
        message: "Password must be between 8 and 16 characters",
    },
    {
        test: (pw) => /[A-Z]/.test(pw),
        message: "Password must contain at least one uppercase letter",
    },
    {
        test: (pw) => /[a-z]/.test(pw),
        message: "Password must contain at least one lowercase letter",
    },
    {
        test: (pw) => /[0-9]/.test(pw),
        message: "Password must contain at least one number",
    },
    {
        test: (pw) => !/\s/.test(pw),
        message: "Password must not contain spaces",
    },
    {
        test: (pw) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(pw),
        message: "Password must contain at least one special character",
    }
];

export const passwordValidator = (password) => {
    const failedRule = Password_Rules.find(rule => !rule.test(password));
    return failedRule ?  failedRule.message : null;
}