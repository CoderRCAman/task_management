const router = require('express').Router()
const EmployeeCtrl = require('../controllers/empCtrl')
const {auth} = require('../middleware/auth')

router.route('/employee/login')
.post(EmployeeCtrl.employeeLogin)

router.route('/employee')
.get(EmployeeCtrl.getEmployees)
.post(EmployeeCtrl.createEmployee)

router.route('/employee/project/:id')
.get(EmployeeCtrl.getProject) 

router.route('/employee/:id')
.get(EmployeeCtrl.getEmployeeById)  

router.patch('/update',auth, EmployeeCtrl.updateUser)

router.get('/infor',auth,EmployeeCtrl.getEmployee)

router.post('/upload/:task_id/:user_id',EmployeeCtrl.userUpdate) 
router.post('/reply' ,EmployeeCtrl.managerUpdate ) ;

router.patch('/emp/task/:id',EmployeeCtrl.updateEmployeeTask) ; 
// router.route('/employee/:id')
// .patch(EmployeeCtrl.updateEmployee)
// .delete(EmployeeCtrl.deleteEmployee)




module.exports = router