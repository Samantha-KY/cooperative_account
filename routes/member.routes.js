const express = require('express');
// const fileUpload = require('express-fileupload');
const router = express.Router();
const {getAllMembers, createNewMember, updateMember, deleteMember, findMemberById} = require('../controllers/member.controller');



router.get('/', getAllMembers);

router.get('/:id',findMemberById);

router.patch('/:id', updateMember);

router.delete('/:id', deleteMember);

module.exports = router;