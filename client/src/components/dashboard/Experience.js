import React,{Fragment, Profiler} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import formatDate from '../../utils/formatDate'
import {deleteExperience} from '../../actions/profile'

const Experience = ({experience,deleteExperience}) => {
    const experiences = experience.map(exp => (
        <tr key={exp._id}>
            <td>{exp.company}</td>
            <td className="hide-sm">{exp.title}</td>
            <td>
                {formatDate(exp.from)} {' '}- {' '} {exp.to === null ? 'Now' : formatDate(exp.to)}
            </td>
            <td>
                <button className='btn btn-danger' onClick={() => {
                    deleteExperience(exp._id);
                    window.scrollTo(0, 0);
                }}>
                    Delete
                </button>
            </td>

        </tr>
    ));

    return (
        <Fragment>
            <h2 className="my-2">Experience Credentials</h2>
            <table className='table'>
                <thead>
                    <tr>
                        <th>Company</th>
                        <th className="hide-sm">Title</th>
                        <th className="hide-sm">Years</th>
                        <th />
                    </tr>
                </thead>
                <tbody>
                    {experiences}
                </tbody>
            </table>
        </Fragment>
    )
}

Experience.propTypes = {
    experience: PropTypes.array.isRequired,
    deleteExperience: PropTypes.func.isRequired
}

export default connect(null, { deleteExperience})(Experience)
