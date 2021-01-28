const express = require('express');
const router = express.Router();
const _ = require('lodash')

module.exports = router

router.get('/', (req, res) => {
  const personalDetails = {
    name: 'Olagunju Mohammed',
    github: '@Olamuhammed',
    email: 'damolagunju@gmail.com',
    mobile: '08112659429'
  }
  res.send({
    message: "My Rule-Validation API",
    status: "success",  
    data: personalDetails
  })
})

router.post('/validate-rule', (req,res) => {
    const errorMessage = validateBody(req.body)
    if(errorMessage){
        return res.status(400).send({ message: errorMessage, status: 'error', data: null })
    }
    const results = validateData(req.body)
    res.send(results)

})

const validateBody = (body) => {

    let {rule, data} = body
    let {field, condition, condition_value} = rule

    if(!rule){
        return('rule is required.')
    }

    if(!data){
        return('data is required.')
    }

    if(typeof(rule) !== 'object'){
        return('rule should be an object.')
    }

    if(typeof(data) !== 'object' && typeof(data) !== 'string'){
        return('data should be an object, array or string.')
    }

    if(!field){
        return('field is required.')
    }

    if(!condition){
        return('condition is required.')
    }

    if(!condition_value){
        return('condition_value is required.')
    }
    
    let comparitor = _.get(data, field)
    if(!comparitor){
        return (`field ${field} is missing from data. `)
    }
}

const validateData = (body) =>{
    let {rule, data} = body
    let {field, condition, condition_value} = rule
    let comparitor = _.get(data, field)

    let pass = {
        message: `field ${field} successfully validated.`,
        status: "success",
        data: {
          validation: {
            error: false,
            field: field,
            field_value: data[field],
            condition: condition,
            condition_value: condition_value
            }
        }
    } 
    
    let fail = {
        message: `field ${field} failed validation.`,
        status: "error",
        data: {
            validation: {
            error: true,
            field: field,
            field_value: data[field],
            condition: condition,
            condition_value: condition_value
            }
        }
    }

    switch (condition) {
        case 'eq':
            if(condition_value === comparitor) return pass
                else {return fail}

            break;
        case 'neq':
            if(condition_value !== comparitor) return pass
                else {return fail}

            break;
        case 'gt':
            if(comparitor > condition_value) return pass
                else {return fail}

            break;
        case 'gte':
            if(comparitor >= condition_value) return pass
                else {return fail}

            break;
        case 'contains':
            if(condition_value.includes(comparitor)) return pass
                else {return fail}

            break;
        default: return({
            message: "condition should be gte, gt, eq, neq or contains.",
            status: "error",
            data: null
        })
            break;
    }
}