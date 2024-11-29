import React from "react";
import {
  Box,
  Typography,
  Divider,
  ListItem,
  ListItemText,
} from "@mui/material";
import { format } from "date-fns";

function SMSMessageView({ selectedGroup }) {
  const formatMessageDate = (date) => format(new Date(date), "dd MMM yyyy");

  const sortedMessages = selectedGroup
    ? [...selectedGroup.messages].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      )
    : [];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflowY: "auto",
        padding: 2,
      }}
    >
      {selectedGroup ? (
        <>
          <Box sx={{ flexGrow: 1, paddingX: 1 }}>
            {sortedMessages.map((message, idx) => {
              const showDivider =
                idx === 0 ||
                formatMessageDate(sortedMessages[idx - 1].date) !==
                  formatMessageDate(message.date);

              return (
                <React.Fragment key={idx}>
                  {showDivider && (
                    <Divider sx={{ marginY: 2, textAlign: "center" }}>
                      <Typography variant="caption" color="textSecondary">
                        {formatMessageDate(message.date)}
                      </Typography>
                    </Divider>
                  )}

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection:
                        message.sender === "self" ? "row-reverse" : "row",
                      alignItems: "flex-start",
                      marginBottom: 2,
                    }}
                  >
                    <ListItem
                      alignItems="flex-start"
                      sx={{ cursor: "pointer" }}
                    >
                      <ListItemText
                        sx={{
                          backgroundColor: "background.more",
                          padding: 2,
                          borderRadius: 2,
                          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                          maxWidth: "70%",
                        }}
                        secondary={
                          <>
                            <Typography
                              variant="body2"
                              color="white"
                              component="span"
                            >
                              {message.text}{" "}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="white"
                              style={{
                                display: "block",
                                textAlign: "right",
                                marginTop: 4,
                              }}
                            >
                              {format(new Date(message.date), "hh:mm a")}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  </Box>
                </React.Fragment>
              );
            })}
          </Box>
        </>
      ) : (
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{
            textAlign: "center",
            marginTop: 4,
          }}
        >
          Select a chat to view messages
        </Typography>
      )}
    </Box>
  );
}

export default SMSMessageView;
