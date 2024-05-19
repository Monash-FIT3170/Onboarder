import { useState, useEffect } from "react"
import {
  Button,
  Typography,
  Table,
  TableContainer,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Paper,
  IconButton,
} from "@mui/material"
import BackIcon from "../assets/BackIcon"
import { useLocation, useNavigate } from "react-router-dom"
import LoadingSpinner from "../components/LoadSpinner"
import { getAppStatusText } from "../util/Util"
import axios from "axios"

export interface SingleApplicationProps {
  id: number
  opening_id: number
  email: string
  name: string
  phone: string
  semesters_until_completion: number
  current_semester: number
  course_enrolled: string
  major_enrolled: string
  cover_letter: string
  skills: string[]
  accepted: string
  created_at: string
}

function ViewOpenPage() {
  // State to manage the sorting direction
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // Placeholder function for handling the sort
  const handleSort = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc")
  }

  const location = useLocation()
  const navigate = useNavigate()
  const [applications, setApplications] = useState<SingleApplicationProps[]>([])
  const [loading, setLoading] = useState(true)

  const state = location.state as {
    id: number
    recruitment_round_id: number
    student_team_name: string
    title: string
    application_count: number
  }

  const generateRowFunction = (applications: SingleApplicationProps[]) => {
    return applications.map((application) => (
      <TableRow key={application.id}>
        <TableCell>{application.name}</TableCell>
        <TableCell>{application.email}</TableCell>
        <TableCell>{getAppStatusText(application.accepted)}</TableCell>
        <TableCell>
          {new Date(application.created_at).toLocaleDateString()}
        </TableCell>
        <TableCell>
          <Button
            variant="contained"
            onClick={() => {
              navigate("/admin-acceptpage", {
                state: {
                  application_id: application.id,
                  opening_name: state.title,
                  recruitment_round_name:
                    state.student_team_name + " " + state.recruitment_round_id,
                  id: state.id,
                  recruitment_round_id: state.recruitment_round_id,
                  student_team_name: state.student_team_name,
                  title: state.title,
                  application_count: state.application_count,
                },
              })
            }}
          >
            View
          </Button>
        </TableCell>
      </TableRow>
    ))
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const applicationsResponse = await axios.get(
          `http://127.0.0.1:3000/openings/${state.id}/applications`
        )
        setApplications(applicationsResponse.data)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [state.id])

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div>
      {/* Creates a button below allowing the user to add positions */}
      <div
        style={{ display: "flex", alignItems: "center", margin: "20px 10px" }}
      >
        <IconButton
          onClick={() =>
            navigate("/recruitment-details-page", {
              state: {
                recruitment_round_id: state.recruitment_round_id,
              },
            })
          }
        >
          <BackIcon />
        </IconButton>
        <Typography variant="h5" style={{ marginLeft: "10px" }}>
          {state.title}
        </Typography>
      </div>

      {/* creates a table showing all the number of applications for each recruitment round */}
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Recruitment Round</TableCell>
              <TableCell>Applications Received for Opening</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{`${state.student_team_name} ${state.recruitment_round_id}`}</TableCell>
              <TableCell>{state.application_count}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <div style={{ marginTop: "50px" }}></div>

      {/* adds a table showing the number of applications for the current opening */}
      <Typography
        variant="h6"
        style={{ marginLeft: "10px", marginTop: "20px" }}
      >
        Opening Applications
      </Typography>
      <input
        type="text"
        id="myInput"
        placeholder="Search..."
        style={{
          width: "100%",
          padding: "16px 20px",
          marginBottom: "20px",
          border: "1px solid #ccc",
          fontSize: "18px",
        }}
      />
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Student Name</TableCell>
              <TableCell>Student Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>
                Date of Submission
                <Button
                  onClick={handleSort}
                  style={{
                    minWidth: "30px",
                    padding: "6px",
                    marginLeft: "5px",
                  }}
                >
                  {sortDirection === "asc" ? "↓" : "↑"}
                </Button>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{generateRowFunction(applications)}</TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default ViewOpenPage
