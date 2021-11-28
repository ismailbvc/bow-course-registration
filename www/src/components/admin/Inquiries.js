import React from 'react'
import Loading from './../misc/Loading'

import { getInquiriesList } from './../../appdata'

export default class Inquiries extends React.Component
{
  async componentDidMount()
  {
    document.title = 'Program Inquiries'
    this.MOUNTED = true
    const inquiries = await getInquiriesList()
    this.MOUNTED && this.setState({ inquiries })
  }

  componentWillUnmount()
  {
    this.MOUNTED = false
  }

  render()
  {
    const { inquiries } = this.state || {}
    
    return (
      <div className="pt-1 p-4">
        <h2 className="text-grey-darkest mb-6">Inquiries</h2>

        { undefined === inquiries ? <div className="flex items-center h-full">
          <Loading className="table m-auto" />
        </div> : <table className="table-fixed w-full text-base leading-normal mb-4" id="dash-table">
          <thead>
            <tr className="bg-grey-light font-bold select-none text-grey-darker text-left tracking-wide uppercase text-xs break-words">
              <th className="p-2">Student Info</th>
              <th className="p-2">Inquiry</th>
            </tr>
          </thead>
          <tbody>
            { inquiries.length ? inquiries.sort((a,b) => b.id - a.id).map(({ date, student, subject, message },i) => <tr key={i} className={`text-xs break-words px-4 py-4 ${i%2 ? 'bg-grey-lightest' : 'bg-grey-lighter'}`}>
              <td className="p-2">{ student.studentID
                ? <React.Fragment>
                  { [student.first_name, student.last_name].filter(Boolean).join(' ') } <br/>
                  <a href={`mailto:${student.email}`} className="text-teal-dark">{ student.email }</a>
                </React.Fragment>
                : <em>Learner not found</em> }</td>
              <td className="p-2">
                <strong>Re: { subject }</strong><br/>
                <p>{ message }</p>
                <span className="mt-1 table text-grey-dark">{ new Date(date).toLocaleString() }</span>
              </td>
            </tr>) : <tr>
              <td colSpan={2} className="p-2">
                <small className="table m-auto italic">No inquiries found.</small>
              </td>
            </tr> }
          </tbody>
        </table> }
      </div>
    )
  }
}