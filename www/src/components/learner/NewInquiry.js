import React from 'react'
import { Link } from 'react-router-dom'
import Loading from './../misc/Loading'

import { insertInquiry } from './../../appdata'

const [ subjectRef, messageRef ] = [ React.createRef(), React.createRef() ]

export default class NewInquiry extends React.Component
{
  async componentDidMount()
  {
    this.MOUNTED = true
    document.title = 'New Inquiry'
  }

  componentWillUnmount()
  {
    this.MOUNTED = false
  }

  async submit(e)
  {
    e.preventDefault()

    const { loading, subject, message } = this.state || {}

    if ( loading )
      return

    this.props.setAlerts(this.props.alerts.filter(err => 'new_inquiry' !== err.type), false)

    if ( ! subject || subject.trim().length < 3 )
      return subjectRef.current.focus()

    if ( ! message || message.trim().length < 10 )
      return messageRef.current.focus()

    this.setState({ loading: true })

    const inserted = await insertInquiry(subject.trim(), message.trim())

    if ( inserted ) {
      this.props.history.push(`/learner/inquiries`)
    } else {
      this.props.setAlerts([{ text: `Error occurred, could not insert new inquiry.`, type: 'new_inquiry' }])
      this.setState({ loading: undefined })
    }
  }

  render()
  {
    const { loading, subject='', message='' } = this.state || {}
    
    return (
      <div className="pt-1 p-4">
        <h2 className="text-grey-darkest mb-6">New Inquiry</h2>

        <form className="w-full" onSubmit={this.submit.bind(this)}>
            <p className="w-full">
              <label className="table text-sm w-full mb-3">
                <strong className="mb-1 table text-grey-darkest">Subject</strong>
                <input className="border focus:border-teal-dark focus:outline-none leading-tight px-3 py-2 rounded text-grey-darker w-full"
                  type="text"
                  value={subject}
                  onChange={e => this.setState({ subject: e.target.value })}
                  disabled={!!loading} ref={subjectRef} />
              </label>

              <label className="table text-sm w-full mb-3">
                <strong className="mb-1 table text-grey-darkest">Message</strong>
                <textarea className="border focus:border-teal-dark focus:outline-none leading-tight px-3 py-2 rounded text-grey-darker w-full"
                  type="text"
                  placeholder="Min. 10 characters"
                  value={message}
                  onChange={e => this.setState({ message: e.target.value })}
                  disabled={!!loading} ref={messageRef} rows={5}></textarea>
              </label>

              <span className="flex items-center text-sm mt-6">
                <input className={`border border-transparent cursor-pointer leading-tight px-4 py-2 rounded text-grey-darker text-white focus:border-teal-dark focus:bg-white focus:text-teal-dark ${loading ? 'bg-grey' : 'bg-teal hover:border-teal-dark hover:bg-white hover:text-teal-dark'}`}
                  type="submit"
                  value={`Submit Inquiry`}
                  disabled={!!loading} />
                  <Link to={`/learner/inquiries`} className="text-teal-dark ml-4">Cancel</Link>
              </span>
            </p>
          </form>
      </div>
    )
  }
}