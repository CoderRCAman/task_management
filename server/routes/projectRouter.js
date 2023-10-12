const router = require('express').Router()
const { getProjectById, addAttachment, updateStatus, enrollEmployee,addTaskAttachment } = require('../controllers/projectCtrl');
const projectCtrl = require('../controllers/projectCtrl')


router.route('/project')
.get(projectCtrl.getProjects)
.post(projectCtrl.createProject)

router.route('/project/:id')
.get(getProjectById) 
.patch(projectCtrl.updateProject)
.delete(projectCtrl.deleteProject)


router.route('/project/attachment/:id') 
.post(addAttachment)

router.route('/project/status/:id') 
.post(updateStatus) 




router.route('/project/enroll/:id') 
.post(enrollEmployee) ;

router.route('/task/status') 
.post(projectCtrl.updateTaskStatus)

router.route('/task/:id')
.get(projectCtrl.getTask)
.post(projectCtrl.createTask)
.patch(projectCtrl.updateTask)
.delete(projectCtrl.deleteTask)

router.route('/task/attachment/:id')
.post(addTaskAttachment)


router.route("/taskId/:id")
.get(projectCtrl.getTaskById)





module.exports = router