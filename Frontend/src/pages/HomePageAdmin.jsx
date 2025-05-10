import { Padding } from "@mui/icons-material"
import { Box, Typography } from "@mui/material"
import Grid from '@mui/material/Grid2';
import StatisticsCard from "../components/AdminComponents/StatisticsCard";
import AttendanceCount from "../components/AdminComponents/AttendanceCount";
import MainCard from "../components/AdminComponents/MainCard";
import TeacherTable from "../components/AdminComponents/TeacherTable";
import StudentTable from "../components/AdminComponents/StudentTable";

function HomePageAdmin(){
    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            {/* row 1 */}   
            <Grid sx={{ mb: -2.25 }} size={12}>
                <Typography variant="h5">Dashboard</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <StatisticsCard title="Total student" count="4,42,236" percentage={59.3} extra="35,000" color="warning" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <StatisticsCard title="Total teacher" count="4,42,236" percentage={59.3} isLoss extra="35,000"  />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <StatisticsCard title="Total class" count="4,42,236" percentage={59.3} isLoss extra="35,000"  />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <StatisticsCard title="Total Attendant" count="4,42,236" percentage={59.3} extra="35,000" color="warning" />
            </Grid>
            {/* {row 2} */}
            <Grid size={{ xs: 12, md: 7, lg: 8 }}>
                <AttendanceCount />
            </Grid>
            {/* row 3 */}
            <Grid size={{ xs: 12, md: 7, lg: 8 }}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid>
                        <Typography variant="h5">Teacher List</Typography>
                    </Grid>
                <Grid />
            </Grid>
            <MainCard sx={{ mt: 2 }} content={false}>
                <TeacherTable />
            </MainCard>
            </Grid>

            {/* {row 4} */}
            <Grid size={{ xs: 12, md: 7, lg: 8 }}>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid>
                        <Typography variant="h5">Student List</Typography>
                    </Grid>
                <Grid />
            </Grid>
            <MainCard sx={{ mt: 2 }} content={false}>
                <StudentTable />
            </MainCard>
            </Grid>
        </Grid>
    )
}

export default HomePageAdmin