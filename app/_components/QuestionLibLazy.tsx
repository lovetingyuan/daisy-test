'use client'
import dynamic from 'next/dynamic'
import Loading from './Loading'

function Test() {
  return <p>this is test</p>
}

const QuestionLibLazy = dynamic(() => Promise.resolve({ default: Test }), {
  loading: () => <Loading />,
})

export default QuestionLibLazy
