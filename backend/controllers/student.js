const mongoose = require('mongoose')
const Student = require('../models/student')
const bcrypt = require('bcrypt')
const asyncHandler = require('express-async-handler')
const { generateToken } = require('../utils/index')
const uploadToCloudinaryModule = require('../utils/index')
const CollegeStaff = require('../models/college_staff')
const Company = require('../models/Company')
const fs = require('fs')
const { log } = require('console')
const handleStudentSignUP = asyncHandler(async (req, res, next) => {
  try {
    //get credential from body
    // First Name , Last Name , Email , phnono password confirm pass
    const { emailID, firstName, lastName, phone, password, cpass } = req.body

    // basic checks
    if (!emailID || !password || !firstName || !lastName || !phone || !cpass) {
      res.status(401)
      throw new Error('Please fill up all the required fileds')
    }
    if (password.length < 6 || cpass.length < 6) {
      res.status(401)
      throw new Error(
        'Password must be at least 6 characters long. Please choose a stronger password.'
      )
    }

    if (password !== cpass) {
      res.status(401)
      throw new Error(
        'Password and confirmation password do not match. Please ensure both passwords are the same.'
      )
    }

    if (phone.length !== 10) {
      res.status(401)
      throw new Error('Please enter a valid phone number..')
    }
    // check if student with given emailID or phone exists or not
    const existingStudent = await Student.findOne({
      $or: [
        { 'personalDetail.emailID': emailID },
        { 'personalDetail.phone': phone }
      ]
    })

    // if student exists then
    if (existingStudent) {
      res.status(409)
      throw new Error('Student Already Exists!')
    }

    //hash the given password
    const hashedPass = await bcrypt.hash(password, 10)

    // create new student account with credentials and hash password
    let student = await Student.create({
      personalDetail: {
        emailID,
        firstName,
        lastName,
        phone,
        password: hashedPass
      }
    })

    // store the studentID of above created student
    const studentID = new mongoose.Types.ObjectId(student.id)

    // Try to update colleges and companies if they exist
    try {
      await CollegeStaff.updateMany({
        $push: { studentDetails: studentID }
      })
      await Company.updateMany({
        $push: { studentDetails: studentID }
      })
    } catch (error) {
      console.log('No colleges or companies found to update')
    }

    // generate token using above created student's student id
    const usrTyp = 'student'
    const token = generateToken(student._id.toString(), usrTyp)

    // since student account is created now save userType and token in cookie
    res.cookie('token', token, {
      path: '/',
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400) // 1 day
    })
    res.cookie('userType', usrTyp, {
      path: '/',
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400) // 1 day
    })

    res.status(201).json({ message: 'Account Created Successfully' })
  } catch (error) {
    next(error)
  }
})

const handleStudentSignIN = asyncHandler(async (req, res, next) => {
  try {
    const { emailID, password } = req.body
    // console.log(emailID);
    // check if emailID or password is present or not
    if (!emailID || !password) {
      res.status(401)
      throw new Error('Please fill up all the required fileds')
    }

    // check if there is existing student or not
    const existingStudent = await Student.findOne({
      'personalDetail.emailID': emailID
    })
    if (existingStudent) {
      // if student is present

      //check if the provided password and stored password is same or not
      // console.log(student.personalDetail.password ,  password);
      const isPasswordCorrect = await bcrypt.compare(
        password,
        existingStudent.personalDetail.password
      )

      if (isPasswordCorrect) {
        // since password is correct, now save userType and token in cookie
        const usrTyp = 'student'
        const token = generateToken(existingStudent._id.toString(), usrTyp)
        res.cookie('token', token, {
          path: '/',
          httpOnly: true,
          expires: new Date(Date.now() + 1000 * 86400), // 1 day
          sameSite: 'none',
          secure: true
        })

        res.cookie('userType', usrTyp, {
          path: '/',
          httpOnly: true,
          expires: new Date(Date.now() + 1000 * 86400), // 1 day
          sameSite: 'none',
          secure: true
        })
        res.status(201).json({ message: 'Signed In Successfully' })
      } else {
        res.status(401)
        throw new Error('Invalid EmailID or Password.')
      }
    } else {
      res.status(403)
      throw new Error("Student doesn't exists.")
    }
  } catch (error) {
    next(error)
  }
})

const handleStudentSignOUT = asyncHandler(async (req, res) => {
  try {
    res.cookie('token', '', {
      path: '/',
      httpOnly: true,
      expires: new Date(0) // 1 day
    })
    res.cookie('userType', '', {
      path: '/',
      httpOnly: true,
      expires: new Date(0) // 1 day
    })
    res.status(201).json({ message: 'signout successfull' })
  } catch (error) {
    res.status(500)
    throw new Error('Internal Server Error')
  }
})

const handleStudentProfileUpdate = asyncHandler(async (req, res) => {
  try {
    const data = req.body

    const dataType = data.typ
    const dataVal = data.value
    // console.log(data);
    const personalDetail = req.user.personalDetail
    if (!data) {
      res.status(401)
      throw new Error('Unsufficent data')
    } else {
      // const user = await Student.updateOne({_id : req.user.id} , {$set : {"personalDetail" : data}})
      const user = await Student.findById(req.user.id)
      // console.log("" ,{...personalDetail ,password : user.personalDetail.password , ...dataVal} );

      if (dataType === 'personalDetail') {
        await Student.updateOne(
          { _id: req.user.id },
          {
            $set: {
              personalDetail: {
                ...personalDetail,
                password: user.personalDetail.password,
                ...dataVal
              }
            }
          }
        )
      } else if (dataType === 'educationalDetails') {
        await Student.updateOne(
          { _id: req.user.id },
          { $set: { educationalDetails: dataVal } }
        )
      }
      // const user = await Student.findOneAndUpdate({_id : req.user.id} , {$set : {"personalDetail" : {...personalDetail , ...data}}}
      // , {returnDocument : "after"})
      else if (dataType === 'internships') {
        await Student.updateOne(
          { _id: req.user.id },
          { $push: { 'pastInternshipsProjects.internships': dataVal } }
        )
      } else if (dataType === 'projects') {
        await Student.updateOne(
          { _id: req.user.id },
          { $push: { 'pastInternshipsProjects.projects': dataVal } }
        )
      }
      if (user) {
        res.json({ message: 'Details Updated Successfully' })
      } else {
        res.status(401)
        throw new Error('Details Update Failed')
      }
    }
  } catch (error) {
    console.log(error)

    res.status(500)
    throw new Error('Internal Server Error')
  }
})

const handleGetUserData = asyncHandler(async (req, res) => {
  try {
    console.log('student', req.user)
    if (req.user) {
      res.status(200).json({ message: req.user })
    } else {
      res.status(403)
      throw new Error('No such user')
    }
  } catch (error) {
    throw new Error('Internal Server Error')
  }
})

const handleUploadResume = asyncHandler(async (req, res) => {
  try {
    if (!req.file) {
      res.status(401)
      throw new Error('Please upload a valid file.')
    } else if (req.file.size > 50000000) {
      res.status(401)
      throw new Error('Please upload file of size less than 5 MB')
    } else {
      const upload = await uploadToCloudinaryModule.cloudinary.uploader.upload(
        req.file.path,
        {
          folder: 'Placement_Web_Portal/student/resume',
          resource_type: 'image'
        }
      )

      if (upload) {
        const user = await Student.findById(req.user.id)
        const updated = await Student.updateOne(
          { _id: req.user.id },
          { $set: { resume: upload.secure_url } }
        )
        // console.log(upload);

        if (updated.modifiedCount === 1) {
          fs.unlink(req.file.path, (err) => {
            if (err) {
              console.log(err)
            }
            // else{
            //   console.log("File deleted successfully");
            // }
          })
          res.status(201).json({ message: 'Resume uploaded successfully' })
        } else {
          res.status(500)
          throw new Error('Internal Server Error')
        }
      } else {
        res.status(500)
        throw new Error('Internal Server Error')
      }
    }
  } catch (error) {
    console.log(error)
    res.status(500)
    throw new Error('Internal Server Error')
  }
})
const handleUploadProfilePicture = asyncHandler(async (req, res) => {
  // console.log(req.file);
  try {
    if (!req.file) {
      res.status(401)
      throw new Error('Please upload a valid image.')
    } else if (req.file.size > 10000000) {
      res.status(401)
      throw new Error('Please upload file of size less than 1 MB')
    } else {
      const upload = await uploadToCloudinaryModule.cloudinary.uploader.upload(
        req.file.path,
        {
          folder: 'Placement_Web_Portal/student/profile_photo',
          resource_type: 'image',
          public_id: 'profilePic'
        }
      )
      if (upload) {
        const personalDetail = req.user.personalDetail
        const user = await Student.findById(req.user.id)
        const updated = await Student.updateOne(
          { _id: req.user.id },
          {
            $set: {
              personalDetail: {
                ...personalDetail,
                password: user.personalDetail.password,
                profilePicture: upload.secure_url
              }
            }
          }
        )

        if (updated.modifiedCount === 1) {
          fs.unlink(req.file.path, (err) => {
            if (err) {
              console.log(err)
            }
            // else{
            //   console.log("File deleted successfully");
            // }
          })

          res
            .status(201)
            .json({ message: 'Profile picture updated successfully' })
        } else {
          res.status(500)
          throw new Error('Internal Server Error')
        }
      } else {
        res.status(500)
        throw new Error('Internal Server Error')
      }
    }
  } catch (error) {
    console.log(error)
    res.status(500)
    throw new Error('Internal Server Error')
  }
})

const handleGetJobs = asyncHandler(async (req, res) => {
  try {
    const companies = await Company.find()
    const allCompniesJobs = []

    companies.map((eachCompany) => {
      allCompniesJobs.push({
        company: eachCompany.company,
        jobs: eachCompany.jobs
      })
    })
    if (companies) {
      res.status(200).json({ message: allCompniesJobs })
    }
  } catch (error) {}
})

const handleJobApplyByStudent = asyncHandler(async (req, res, next) => {
  try {
    const { jobID } = req.body
    // console.log(jobID);
    if (jobID) {
      // find if student is already applied or not

      const existingApplication = await Student.find({
        'applicationStatus.appliedJobID': jobID
      })

      if (existingApplication) {
        console.log(existingApplication)
        res.status(401)
        throw new Error("You've already applied")
      } else {
        const jobApplied = await Student.findOneAndUpdate(
          { _id: req.user.id },
          {
            $push: {
              applicationStatus: { appliedJobID: jobID }
            }
          }
        )

        // console.log(jobApplied);
        if (jobApplied) {
          res.status(200).json({ message: 'Job Applied Succesfully' })
        } else {
          res.status(400)
          throw new Error('Error , Job Apply')
        }
      }
    } else {
      throw new Error('Internal Server Error')
    }
  } catch (error) {
    next(error)
  }
})

module.exports = {
  handleStudentSignUP,
  handleStudentSignIN,
  handleStudentSignOUT,
  handleStudentProfileUpdate,
  handleGetUserData,
  handleUploadResume,
  handleUploadProfilePicture,
  handleGetJobs,
  handleJobApplyByStudent
}
