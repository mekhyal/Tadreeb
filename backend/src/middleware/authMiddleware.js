const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Company = require('../models/Company');
const Student = require('../models/Student');
const { companyMayUsePortal } = require('../utils/companyAccountStatus');

const getAccountForToken = async ({ id, role }) => {
    if (role === 'student') {
        return Student.findById(id).select('status role');
    }
    if (role === 'company') {
        return Company.findById(id).select('status role');
    }
    if (role === 'admin') {
        return Admin.findById(id).select('status role');
    }
    return null;
};

const accountMayUsePortal = (account, role) => {
    if (!account) return false;
    if (role === 'student') return (account.status || 'active') === 'active';
    if (role === 'company') return companyMayUsePortal(account.status);
    if (role === 'admin') return (account.status || 'Active') === 'Active';
    return false;
};

const protect = async (req,res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith('Bearer ')){
            return res.status(401).json({message: 'Not authorized, no token'});
        }

        const token = authHeader.split(' ')[1];
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const account = await getAccountForToken(decode);

        if (!accountMayUsePortal(account, decode.role)) {
            return res.status(403).json({
                message: 'This account is not active. Please contact an administrator.',
            });
        }

        req.user = decode;

        next();
    }
    catch(error){
        return res.status(401).json({ message: 'Not authorized, token failed'});
    }
};

module.exports = protect;
