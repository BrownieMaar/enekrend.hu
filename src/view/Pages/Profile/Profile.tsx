import { useParams } from "react-router-dom"
import { useState } from "react"
import { AppUser } from "../../../model/types/UserTypes";
import { DatabaseContext } from "../../App";
import { useEffect, useContext } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Avatar, Box, Card, Divider, Paper, Skeleton, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import { setWindowTitle } from "../routes";

function ProfileCard({ appUser }: { appUser: AppUser | undefined }) {
    return <Card sx={{ width: "min-content", p: 4, m: "auto", mt: 2 }}>
        <Stack direction="row" spacing={4} justifyContent={"center"} alignItems={"center"}>
            {
                appUser ?
                    <Avatar alt={appUser.displayName ?? undefined} src={appUser.photoUrl ?? undefined} sx={{ width: 100, height: 100 }} />
                    :
                    <Skeleton variant="circular" width={100} height={100} />
            }
            <Divider orientation="vertical" flexItem variant="middle" />
            <Stack direction="column" spacing={1} justifyContent={"center"} alignItems={"center"}>
                {
                    appUser ?
                        <Typography variant="h3" sx={{ whiteSpace: "nowrap" }}>{appUser.displayName}</Typography>
                        :
                        <Skeleton variant="text" width={200} height={50} />
                }
                {
                    appUser ?
                        <Typography variant={"subtitle1"} sx={{ whiteSpace: "nowrap", alignSelf: "flex-start" }}>
                            <Box component={"span"} sx={{ fontStyle: "italic" }}>Joined: </Box>
                            {appUser.created.toDate().toLocaleDateString()}
                        </Typography>
                        :
                        <Skeleton variant="text" width={200} height={30} />
                }
            </Stack>
        </Stack>
    </Card>
}

export default function Profile() {
    const { uid } = useParams();
    const db = useContext(DatabaseContext)
    const [appUser, setAppUser] = useState<AppUser | undefined>(undefined);

    useEffect(() => {
        if (uid === undefined) return;
        db.getAppUserData(uid).then(user => {
            setAppUser(user)
            setWindowTitle("Profile - " + user.displayName ?? "User")
        });
    }, []);

    return <ProfileCard appUser={appUser} />
}