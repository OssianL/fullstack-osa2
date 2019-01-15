import React from 'react'

const Header = ({course}) => (
  <h1>{course.name}</h1>
)

const Part = ({part}) => (
  <p>{part.name} {part.exercises}</p>
)

const Content = ({parts}) => (
  <div>
    {parts.map(part => (<Part part={part} key={part.id}/>))}
  </div>
)

const Total = ({parts}) => (
  <p>yhteensä {parts.reduce((sum, part) => sum + part.exercises, 0)} tehtävää</p>
)

const Course = ({course}) => (
  <div>
    <Header course={course} />
    <Content parts={course.parts} />
    <Total parts={course.parts} />
  </div>
)

export default Course;