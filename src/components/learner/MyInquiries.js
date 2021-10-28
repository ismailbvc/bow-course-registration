import React from 'react'
import { Link } from 'react-router-dom'
import Loading from './../misc/Loading'

import { getInquiriesList } from './../../appdata'

export default class MyInquiries extends React.Component
{
  async componentDidMount()
  {
    document.title = 'My Inquiries'
    this.MOUNTED = true
    const inquiries = await getInquiriesList(this.props.authLearner.user.studentID)
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
        <h2 className="text-grey-darkest mb-6">
          My Inquiries
          <Link to={`/learner/inquiries/create`}
            className="bg-teal-dark leading-normal ml-4 no-underline px-3 py-0 rounded select-none text-lg text-white"
            dangerouslySetInnerHTML={{ __html: '&plus;' }}></Link>
        </h2>

        { undefined === inquiries ? <div className="flex items-center h-full">
          <Loading className="table m-auto" />
        </div> : <table className="table-fixed w-full text-base leading-normal mb-4" id="dash-table">
          <thead>
            <tr className="bg-grey-light font-bold select-none text-grey-darker text-left tracking-wide uppercase text-xs break-words">
              <th className="p-2">Inquiry</th>
            </tr>
          </thead>
          <tbody>
            { inquiries.length ? inquiries.sort((a,b) => b.id - a.id).map(({ date, subject, message },i) => <tr key={i} className={`text-xs break-words px-4 py-4 ${i%2 ? 'bg-grey-lightest' : 'bg-grey-lighter'}`}>
              <td className="p-2">
                <strong>Re: { subject }</strong><br/>
                <p>{ message }</p>
                <span className="mt-1 table text-grey-dark">{ new Date(date).toLocaleString() }</span>
              </td>
            </tr>) : <tr>
              <td colSpan={1} className="p-2">
                <small className="table m-auto italic">No inquiries found.</small>
              </td>
            </tr> }
          </tbody>
        </table> }
      </div>
    )
  }
}