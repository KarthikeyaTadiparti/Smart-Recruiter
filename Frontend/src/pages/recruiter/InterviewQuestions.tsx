import { useParams } from "react-router-dom"
const InterviewQuestions = () => {
    const { id } = useParams()
    console.log("id : ", id);
    return (
        <div>
            <h1>Interview Questions</h1>
        </div>
    )
}

export default InterviewQuestions