const people = []

const listPeople = (req, res) => {
    res.json(people)
}

const addPerson = (req, res) => {
    if (!req.body.name) {
        return res.status(400).json({ error: 'Please enter a name.' })
    }
    if (!req.body.age) {
        return res.status(400).json({ error: 'Please enter an age.' })
    }
    const age = Number(req.body.age)
    if (isNaN(age) || age < 0) {
        return res.status(400).json({ error: 'The age must be a non-negative number.' })
    }
    req.body.age = age
    req.body.index = people.length
    people.push(req.body)
    res.status(201).json({ message: 'A person record was added.', index: req.body.index })
}


const singlePerson = (req, res) => {
    const index = Number(req.params.id)
    if (isNaN(index) || !Number.isInteger(index) || index < 0 || index >= people.length) {
        return res.status(404).json({ message: 'The person record was not found.' })
    }
    res.json(people[index])
}


module.exports = { listPeople, addPerson, singlePerson }