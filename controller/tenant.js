const { validationResult } = require('express-validator');

const Tenant = require('../model/tenant');
const Hostel = require('../model/hostel');


exports.getTenants = async (req, res, next) => {
    console.log('In getTenants');
    try {
        const hostelId = req.params.hostelId;
        const hostel = await Hostel.findById(hostelId).populate('myTenants.tenantId');

        let myTenants = {};
        hostel.myTenants.forEach(myTenant => {
            myTenants[[myTenant.tenantId._id]] = {
                name: myTenant.tenantId.name,
                imageUrl: myTenant.tenantId.imageUrl,
                priMobile: myTenant.tenantId.priMobile,
                email: myTenant.tenantId.email,
                secMobile: myTenant.tenantId.secMobile,
                address: myTenant.tenantId.address,
                hostelId: myTenant.tenantId.hostelId,
            };
        });
        console.log(myTenants);
        res.status(200).json({ myTenants });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }

};

exports.getTenantByMobile = async (req, res, next) => {
    console.log('In getTenantByMobile');
    try {
        const mobileNumber = req.params.mobileNumber;
        const tenant = await Tenant.findOne({ priMobile: mobileNumber });

        if (!tenant) {
            const err = new Error('NO_RECORD_FOUND');
            err.statusCode = 404;
            throw err;
        }
        res.status(200).json({
            [tenant._id]: {
                name: tenant.name,
                imageUrl: tenant.imageUrl,
                priMobile: tenant.priMobile,
                email: tenant.email,
                secMobile: tenant.secMobile,
                address: tenant.address,
                hostelId: tenant.hostelId,
            }
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.postTenant = async (req, res, next) => {
    console.log('In postTenant');
    const errors = validationResult(req);
    try {
        if (!errors.isEmpty()) {
            const err = new Error(errors.array()[0].msg);
            err.statusCode = 422;
            err.data = errors.array();
            throw err;
        }
        const name = req.body.name;
        const imageUrl = req.body.imageUrl;
        const priMobile = req.body.priMobile;
        const email = req.body.email;
        const secMobile = req.body.secMobile;
        const address = req.body.address;
        const hostelId = req.body.hostelId;

        console.log(hostelId);
        console.log(name);
        const hostel = await Hostel.findById(hostelId);
        if (!hostel) {
            const err = new Error('INVALID_HOSTEL_ID');
            err.statusCode = 401;
            throw err;
        }
        const tenant = new Tenant({
            name: name,
            imageUrl: imageUrl,
            priMobile: priMobile,
            email: email,
            secMobile: secMobile,
            address: address,
            hostelId: hostelId
        });

        const result = await tenant.save();
        hostel.myTenants.push({ priMobile: priMobile, tenantId: tenant._id });
        await hostel.save();
        console.log('Tenant created successfully.');
        res.status(200).json({
            name: tenant._id,
            message: 'Tenant created successfully.',
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};

exports.patchTenant = async (req, res, next) => {
    console.log('In pactchTenant');
    const errors = validationResult(req);
    try {
        if (!errors.isEmpty()) {
            const err = new Error(errors.array()[0].msg);
            err.statusCode = 422;
            err.data = errors.array();
            throw err;
        }
        const tenantId = req.params.tenantId;

        const name = req.body.name;
        const imageUrl = req.body.imageUrl;
        const priMobile = req.body.priMobile;
        const email = req.body.email;
        const secMobile = req.body.secMobile;
        const address = req.body.address;
        const hostelId = req.body.hostelId;

        // console.log(hostelId);
        // console.log(name);
        const tenant = await Tenant.findById(tenantId);
        tenant.name = name;
        tenant.imageUrl = imageUrl;
        // tenant.priMobile = priMobile; // Primary Mobile should not be changed.
        tenant.email = email;
        tenant.secMobile = secMobile;
        tenant.address = address;
        // tenant.hostelId = hostelI; // HostelId should be changed.

        result = await tenant.save();

        console.log(`Hostel Id: ${hostelId}`);

        const hostel = await Hostel.findById(hostelId).populate('myTenants.tenantId');
        if (!hostel) {
            const err = new Error('INVALID_HOSTEL_ID');
            err.statusCode = 401;
            throw err;
        }
        // console.log(hostel.myTenants);
        console.log(`update tenant id: ${tenant._id}`);
        let myT = [];
        hostel.myTenants.forEach(t => {
            // console.log(`inside map: ${t.tenantId._id}`);
            // console.log(t);
            if (t.tenantId._id.toString() === tenant._id.toString()) {
                // console.log(`matched: ${t.tenantId}`);
                myT.push(t.tenantId);
            }
        });
        
        // console.log(myT);
        if (myT.length === 0) {
            console.log(`Tenant Added in myTenant: ${tenant.priMobile}`);
            hostel.myTenants.push({ priMobile: tenant.priMobile, tenantId: tenant._id });
            await hostel.save();
        }

        res.status(200).json({
            message: 'TENANT_UPDATE_SUCCESSFUL',
            name: tenant.name,
            imageUrl: tenant.imageUrl,
            priMobile: tenant.priMobile,
            email: tenant.email,
            secMobile: tenant.secMobile,
            address: tenant.address,
            hostelId: tenant.hostelId,
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};