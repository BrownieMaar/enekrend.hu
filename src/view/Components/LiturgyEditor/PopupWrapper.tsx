import { Box, Dialog } from "@mui/material";

export function PopupWrapper({ children, onClose }: { children: React.ReactNode; onClose: () => void; }) {
    const open = Boolean(children);
    return open
        ? (
            <Dialog onClose={onClose} open={open} fullWidth maxWidth="md">
                <Box p={2}>
                    {children}
                </Box>
            </Dialog>
        )
        : null;
}
