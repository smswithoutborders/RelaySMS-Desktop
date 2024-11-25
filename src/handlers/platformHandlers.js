import {
  DisplayPanel,
  ControlPanel,
  ServiceList,
  GatewayClientList,
  MessageList,
  ItemsList,
} from "../Components";
import { ComposeForm, PasswordForm, OTPForm } from "../Forms";
import { DialogView, SettingView, ComposeView } from "../Views";
import {
  fetchGatewayClients,
  sendSms,
  encryptPayload,
  fetchPlatforms,
  listEntityStoredTokens,
  updateEntityPassword,
  deleteEntity,
  createTransmissionPayload,
  addOAuth2Token,
  deleteOAuth2Token,
  addPNBAToken,
  deletePNBAToken,
  UserController,
  MessageController,
  SettingsController,
} from "../controllers";

const languages = [
  { name: "English" },
  { name: "French" },
  { name: "Persian" },
  { name: "Spanish" },
  { name: "Turkish" },
];

export const executeSelect = async ({
  actionName,
  selectFunction,
  setControlPanel,
  setDisplayPanel,
  setAlert,
  currentActionRef,
}) => {
  if (currentActionRef.current !== actionName) {
    currentActionRef.current = actionName;
  } else {
    return;
  }

  setDisplayPanel(null);

  await selectFunction({
    actionName,
    currentActionRef,
    setControlPanel,
    setDisplayPanel,
    setAlert,
  });

  if (currentActionRef.current === actionName) {
    currentActionRef.current = null;
  }
};

const handlePlatformComposeClick = ({
  setDisplayPanel,
  setAlert,
  platform,
}) => {
  const messageController = new MessageController();

  const handleFormSubmit = async (data) => {
    try {
      const gatewayClients = await fetchGatewayClients();

      const activeGatewayClient = gatewayClients.find(
        (client) => client.active === true
      );

      if (!activeGatewayClient) {
        setAlert({
          open: true,
          severity: "error",
          message:
            "No active gateway client selected. Please select one and try again.",
        });
        return;
      }

      let structuredContent;

      switch (platform.service_type) {
        case "email":
          structuredContent = `${data.from}:${data.to}:${data.cc}:${data.bcc}:${data.subject}:${data.body}`;
          break;

        case "text":
          structuredContent = `${data.from}:${data.body}`;
          break;

        case "message":
          structuredContent = `${data.from}:${data.to}:${data.body}`;
          break;

        default:
          setAlert({
            open: true,
            severity: "error",
            message: `Unsupported service type: ${platform.service_type}`,
          });
          break;
      }

      const contentCiphertext = await encryptPayload(structuredContent);
      const transmissionPayload = await createTransmissionPayload({
        contentCiphertext,
        platformShortCode: platform.shortcode,
      });

      const smsPayload = {
        number: activeGatewayClient.msisdn,
        text: transmissionPayload,
      };

      const { err } = await sendSms({ smsPayload });

      if (err) {
        setAlert({
          open: true,
          severity: "error",
          message: err,
        });
        return;
      }

      const existingMessages =
        (await messageController.getData("relaysms")) || [];
      const newMessage = {
        raw: data,
        platform: platform,
        avatar: platform.avatar,
        id: existingMessages.length + 1,
        text: data.body,
        title: data.from,
        date: new Date().toISOString(),
      };

      const updatedMessages = [...existingMessages, newMessage];
      await messageController.setData("relaysms", updatedMessages);

      setDisplayPanel(null);

      setAlert({
        open: true,
        severity: "success",
        message: "Message is ready and queued for sending.",
      });
    } catch (error) {
      setAlert({
        open: true,
        severity: "error",
        message: "Oops, something went wrong. Please try again later.",
      });
    }
  };

  let fields;

  switch (platform.name) {
    case "Gmail":
      fields = [
        {
          name: "from",
          label: "From",
          required: true,
          type: "select",
          options: platform.identifiers.map((data) => ({
            label: data,
            value: data,
          })),
          defaultValue: platform.identifiers?.[0] || "",
        },
        { name: "to", label: "To", required: true, type: "email" },
        { name: "cc", label: "Cc", required: false },
        { name: "bcc", label: "BCC", required: false },
        { name: "subject", label: "Subject", required: true },
        { name: "body", label: "", required: true, multiline: true, rows: 10 },
      ];
      break;
    case "Twitter":
      fields = [
        {
          name: "from",
          label: "Handle",
          required: true,
          type: "select",
          options: platform.identifiers.map((data) => ({
            label: data,
            value: data,
          })),
          defaultValue: platform.identifiers?.[0] || "",
        },
        {
          name: "body",
          label: "What is happening?",
          required: true,
          multiline: true,
          rows: 8,
        },
      ];
      break;
    case "Telegram":
      fields = [
        {
          name: "from",
          label: "From",
          required: true,
          type: "select",
          options: platform.identifiers.map((data) => ({
            label: data,
            value: data,
          })),
          defaultValue: platform.identifiers?.[0] || "",
        },
        { name: "to", label: "To (Phone Number)", required: true, type: "tel" },
        {
          name: "body",
          label: "Message",
          required: true,
          multiline: true,
          rows: 8,
        },
      ];
      break;
    default:
      fields = [];
  }

  setDisplayPanel(
    <DisplayPanel
      header={`Compose ${platform.name}`}
      body={
        <ComposeView onClose={() => setDisplayPanel(null)}>
          <ComposeForm fields={fields} onSubmit={handleFormSubmit} />
        </ComposeView>
      }
    />
  );
};

export const handlePlatformComposeSelect = async ({
  actionName,
  currentActionRef,
  setControlPanel,
  setDisplayPanel,
  setAlert,
}) => {
  setControlPanel(
    <ControlPanel
      title="Compose"
      element={<ServiceList serviceType="Platform" loading={true} />}
    />
  );

  const [availablePlatforms, storedTokens] = await Promise.all([
    fetchPlatforms(),
    listEntityStoredTokens(),
  ]);

  const tokenMap = storedTokens.res.storedTokens.reduce((acc, token) => {
    const platformKey = token.platform.toLowerCase();
    if (!acc[platformKey]) acc[platformKey] = [];
    acc[platformKey].push(token.account_identifier);
    return acc;
  }, {});

  const filteredPlatforms = availablePlatforms
    .filter((platform) => tokenMap[platform.name.toLowerCase()])
    .map((platform) => ({
      ...platform,
      identifiers: tokenMap[platform.name.toLowerCase()] || [],
    }));

  if (currentActionRef.current !== actionName) return;

  setControlPanel(
    <ControlPanel
      title="Compose"
      element={
        <ServiceList
          serviceType="Platform"
          services={filteredPlatforms}
          onClick={(platform) =>
            handlePlatformComposeClick({ setDisplayPanel, setAlert, platform })
          }
        />
      }
    />
  );
};

const handleOAuth2Platform = async ({
  platform,
  identifier,
  setAlert,
  setControlPanel,
  setDisplayPanel,
  currentActionRef,
}) => {
  if (!identifier) {
    const { err, res } = await addOAuth2Token({
      platform: platform.name.toLowerCase(),
    });

    if (err || !res.success) {
      setAlert({
        open: true,
        severity: "error",
        message: `Failed to add ${platform.name} token: ${err || res.message}`,
      });
      return;
    }

    setAlert({
      open: true,
      severity: "success",
      message: `${platform.name} token added successfully!`,
    });
  } else {
    setDisplayPanel(
      <DialogView
        open={true}
        title={`Revoke Access to ${platform.name}`}
        description={`You are about to revoke access for the identifier "${identifier}". This will permanently remove access to your ${platform.name} account from this app. You will need to reauthorize the app to regain access in the future. Are you sure you want to proceed?`}
        cancelText="Cancel"
        confirmText="Yes, Revoke Access"
        onClose={() => setDisplayPanel(null)}
        onConfirm={async () => {
          const { err, res } = await deleteOAuth2Token({
            platform: platform.name.toLowerCase(),
            identifier,
          });

          if (err || !res.success) {
            setAlert({
              open: true,
              severity: "error",
              message: `Failed to remove ${platform.name} token: ${
                err || res.message
              }`,
            });
            return;
          }

          setAlert({
            open: true,
            severity: "success",
            message: `${platform.name} token removed successfully!`,
          });
        }}
      />
    );
  }

  executeSelect({
    actionName: "Platforms",
    selectFunction: handlePlatformSelect,
    setControlPanel,
    setDisplayPanel,
    setAlert,
    currentActionRef,
  });
};

const handlePNBAAuthWithPassword = async ({
  platform,
  prevData,
  setAlert,
  setControlPanel,
  setDisplayPanel,
  currentActionRef,
}) => {
  const handleFormSubmit = async (data) => {
    const { err, res } = await addPNBAToken({
      ...prevData,
      ...data,
      platform: platform.name.toLowerCase(),
    });

    if (err || !res.success) {
      setAlert({
        open: true,
        severity: "error",
        message: err || res.message,
      });
      return;
    }

    setAlert({
      open: true,
      severity: "success",
      message: `${platform.name} token added successfully!`,
    });

    executeSelect({
      actionName: "Platforms",
      selectFunction: handlePlatformSelect,
      setControlPanel,
      setDisplayPanel,
      setAlert,
      currentActionRef,
    });
  };

  const details = {
    fields: [
      {
        name: "password",
        label: "Two Step Verification Password",
        required: true,
        type: "password",
      },
    ],
    description: `You've enabled two-step verification on your ${platform.name} app. To complete the process, please enter your ${platform.name} two-step verification password.`,
  };

  setDisplayPanel(
    <DisplayPanel
      header={`Complete ${platform.name} Authentication`}
      body={
        <SettingView>
          <OTPForm
            description={details.description}
            fields={details.fields}
            twoStepVerificationEnabled={true}
            onSubmit={handleFormSubmit}
          />
        </SettingView>
      }
    />
  );
};

const handlePNBAAuth = async ({
  platform,
  prevData,
  setAlert,
  setControlPanel,
  setDisplayPanel,
  currentActionRef,
}) => {
  const handleFormSubmit = async (data) => {
    const { err, res } = await addPNBAToken({
      ...prevData,
      ...data,
      platform: platform.name.toLowerCase(),
    });

    if (err || !res.success) {
      setAlert({
        open: true,
        severity: "error",
        message: err || res.message,
      });
      return;
    }

    if (res.two_step_verification_enabled) {
      await handlePNBAAuthWithPassword({
        platform,
        prevData: { ...data, ...prevData },
        setAlert,
        setControlPanel,
        setDisplayPanel,
        currentActionRef,
      });
      return;
    }

    setAlert({
      open: true,
      severity: "success",
      message: `${platform.name} token added successfully!`,
    });

    executeSelect({
      actionName: "Platforms",
      selectFunction: handlePlatformSelect,
      setControlPanel,
      setDisplayPanel,
      setAlert,
      currentActionRef,
    });
  };

  const details = {
    fields: [
      {
        name: "authorizationCode",
        label: "Authorization Code",
        required: true,
        type: "number",
      },
    ],
    description: `An authorization code has been sent to your ${platform.name} app. Please check the app and enter the code below.`,
  };

  setDisplayPanel(
    <DisplayPanel
      header={`Complete ${platform.name} Authentication`}
      body={
        <SettingView>
          <OTPForm
            description={details.description}
            fields={details.fields}
            onSubmit={handleFormSubmit}
          />
        </SettingView>
      }
    />
  );
};

const handlePNBAPlatform = async ({
  platform,
  identifier,
  setAlert,
  setControlPanel,
  setDisplayPanel,
  currentActionRef,
}) => {
  if (!identifier) {
    const handleFormSubmit = async (data) => {
      const { err, res } = await addPNBAToken({
        ...data,
        platform: platform.name.toLowerCase(),
      });

      if (err || !res.success) {
        setAlert({
          open: true,
          severity: "error",
          message: err || res.message,
        });
        return;
      }

      await handlePNBAAuth({
        platform,
        prevData: data,
        setAlert,
        setControlPanel,
        setDisplayPanel,
        currentActionRef,
      });
    };

    const details = {
      fields: [
        {
          name: "phoneNumber",
          label: "Phone Number",
          required: true,
          type: "phone",
        },
      ],
      description: `Please enter the phone number linked to your ${platform.name} account.`,
    };

    setDisplayPanel(
      <DisplayPanel
        header={`Complete ${platform.name} Authentication`}
        body={
          <SettingView>
            <OTPForm
              description={details.description}
              fields={details.fields}
              onSubmit={handleFormSubmit}
            />
          </SettingView>
        }
      />
    );
    return;
  }

  setDisplayPanel(
    <DialogView
      open={true}
      title={`Revoke Access to ${platform.name}`}
      description={`You are about to revoke access for the identifier "${identifier}". This will permanently remove access to your ${platform.name} account from this app. You will need to reauthorize the app to regain access in the future. Are you sure you want to proceed?`}
      cancelText="Cancel"
      confirmText="Yes, Revoke Access"
      onClose={() => setDisplayPanel(null)}
      onConfirm={async () => {
        const { err, res } = await deletePNBAToken({
          platform: platform.name.toLowerCase(),
          identifier,
        });

        if (err || !res.success) {
          setAlert({
            open: true,
            severity: "error",
            message: `Failed to remove ${platform.name} token: ${
              err || res.message
            }`,
          });
          return;
        }

        setAlert({
          open: true,
          severity: "success",
          message: `${platform.name} token removed successfully!`,
        });

        executeSelect({
          actionName: "Platforms",
          selectFunction: handlePlatformSelect,
          setControlPanel,
          setDisplayPanel,
          setAlert,
          currentActionRef,
        });
      }}
    />
  );
};

const handlePlatformClick = async ({
  platform,
  identifier,
  setAlert,
  setControlPanel,
  setDisplayPanel,
  currentActionRef,
}) => {
  try {
    if (platform.protocol_type === "oauth2") {
      await handleOAuth2Platform({
        platform,
        identifier,
        setAlert,
        setControlPanel,
        setDisplayPanel,
        currentActionRef,
      });
    } else if (platform.protocol_type === "pnba") {
      await handlePNBAPlatform({
        platform,
        identifier,
        setAlert,
        setControlPanel,
        setDisplayPanel,
        currentActionRef,
      });
    } else {
      setAlert({
        open: true,
        severity: "error",
        message: `Unsupported protocol type: ${platform.protocol_type}`,
      });
    }
  } catch (error) {
    setAlert({
      open: true,
      severity: "error",
      message: "Oops, something went wrong. Please try again later.",
    });
  }
};

export const handlePlatformSelect = async ({
  actionName,
  currentActionRef,
  setControlPanel,
  setDisplayPanel,
  setAlert,
}) => {
  setControlPanel(
    <ControlPanel
      title="Platforms"
      element={<ServiceList serviceType="Platform" loading={true} />}
    />
  );

  try {
    const [availablePlatforms, storedTokens] = await Promise.all([
      fetchPlatforms(),
      listEntityStoredTokens(),
    ]);

    const tokenMap = storedTokens.res.storedTokens.reduce((acc, token) => {
      const platformKey = token.platform.toLowerCase();
      if (!acc[platformKey]) acc[platformKey] = [];
      acc[platformKey].push(token.account_identifier);
      return acc;
    }, {});

    const filteredPlatforms = availablePlatforms
      .filter((platform) => tokenMap[platform.name.toLowerCase()])
      .map((platform) => ({
        ...platform,
        identifiers: tokenMap[platform.name.toLowerCase()] || [],
      }));

    if (currentActionRef.current !== actionName) return;

    setControlPanel(
      <ControlPanel
        title="Platforms"
        element={
          <ServiceList
            serviceType="Platform"
            services={availablePlatforms}
            lists={filteredPlatforms}
            adornmentIcon={true}
            onClick={(platform, identifier) =>
              handlePlatformClick({
                platform,
                identifier,
                setAlert,
                setControlPanel,
                setDisplayPanel,
                currentActionRef,
              })
            }
          />
        }
      />
    );
  } catch (error) {
    setAlert({
      open: true,
      severity: "error",
      message: "Failed to load platforms. Please try again later.",
    });
  }
};

const handleGatewayClientToggle = async ({ client, setAlert }) => {
  const settingsController = new SettingsController();

  const currentGatewayClients =
    (await settingsController.getData("gatewayclients")) || [];

  const updatedGatewayClients = currentGatewayClients.map((existingClient) =>
    existingClient.msisdn === client.msisdn
      ? { ...client, active: true }
      : { ...existingClient, active: false }
  );

  await settingsController.setData("gatewayclients", updatedGatewayClients);

  setAlert({
    open: true,
    message: `Gateway client ${client.msisdn} is now active.`,
    severity: "success",
  });
};

export const handleGatewayClientSelect = async ({
  actionName,
  currentActionRef,
  setControlPanel,
  setDisplayPanel,
  setAlert,
}) => {
  setControlPanel(
    <ControlPanel
      title="Gateway Clients"
      element={<GatewayClientList items={[]} loading={true} />}
    />
  );

  const gatewayClients = await fetchGatewayClients();

  if (currentActionRef.current !== actionName) return;

  setControlPanel(
    <ControlPanel
      title="Gateway Clients"
      element={
        <GatewayClientList
          items={gatewayClients}
          onSelect={(client) => handleGatewayClientToggle({ client, setAlert })}
        />
      }
    />
  );
};

const handlePlatformMessageClick = (setDisplayPanel, message) => {
  setDisplayPanel(
    <DisplayPanel header={message.title} body={<div>{message.text}</div>} />
  );
};

export const handlePlatformMessageSelect = async ({
  actionName,
  currentActionRef,
  setControlPanel,
  setDisplayPanel,
  setAlert,
}) => {
  setControlPanel(
    <ControlPanel
      title="Messages"
      element={<MessageList messages={[]} loading={true} />}
    />
  );

  const messageController = new MessageController();
  const messages = (await messageController.getData("relaysms")) || [];

  if (currentActionRef.current !== actionName) return;

  setControlPanel(
    <ControlPanel
      title="Messages"
      element={
        <MessageList
          messages={messages}
          onClick={(message) =>
            handlePlatformMessageClick(setDisplayPanel, message)
          }
        />
      }
    />
  );
};

const handleLanguageSelect = ({ setDisplayPanel }) => {
  setDisplayPanel(<DisplayPanel body={<ItemsList items={languages} />} />);
};

const handleChangePasswordSelect = ({ setDisplayPanel, setAlert }) => {
  const messageController = new MessageController();
  const userController = new UserController();

  const changePassword = {
    title: "Change Password Confirmation",
    description:
      "Are you sure you want to change your password? You will need to log in again with your new password. This action cannot be undone.",
    color: "",
  };

  const handleFormSubmit = async (data) => {
    handleChangePasswordSelect({ setDisplayPanel, setAlert });

    const { err, res } = await updateEntityPassword({
      ...data,
    });

    if (err || !res.success) {
      setAlert({
        open: true,
        severity: "error",
        message: `Failed to Change Password: ${err || res.message}`,
      });
      return;
    }

    setAlert({
      open: true,
      severity: "success",
      message: "Password Changed Successfully.",
    });

    await Promise.all([
      await window.api.invoke("clear-ratchet-state"),
      await messageController.deleteTable(),
      await userController.deleteTable(),
    ]);

    setTimeout(async () => {
      await window.api.invoke("reload-window");
    }, 1000);
  };

  setDisplayPanel(
    <DisplayPanel
      header={"Change Password"}
      body={
        <SettingView>
          <PasswordForm
            fields={[
              {
                name: "currentPassword",
                label: "Current Password",
                required: true,
                type: "password",
              },
              {
                name: "newPassword",
                label: "New Password",
                required: true,
                type: "password",
              },
              {
                name: "confirmPassword",
                label: "Confirm New Password",
                required: true,
                type: "password",
              },
            ]}
            activity="change"
            onSubmit={(data) => {
              setDisplayPanel(
                <DialogView
                  open={true}
                  title={changePassword.title}
                  description={changePassword.description}
                  cancelText="cancel"
                  confirmText="yes, change password"
                  onClose={() =>
                    handleChangePasswordSelect({ setDisplayPanel, setAlert })
                  }
                  onConfirm={() => handleFormSubmit(data)}
                />
              );
            }}
          />
        </SettingView>
      }
    />
  );
};

const handleLogoutSelect = ({ setDisplayPanel }) => {
  const messageController = new MessageController();
  const userController = new UserController();

  const logout = {
    title: "Confirm Logout",
    description:
      "Are you sure you want to log out? You will need to log in again to continue using the app. This action cannot be undone.",
    color: "",
  };

  setDisplayPanel(
    <DisplayPanel
      body={
        <DialogView
          open={true}
          title={logout.title}
          description={logout.description}
          cancelText="cancel"
          confirmText="logout"
          onClose={() => setDisplayPanel(null)}
          onConfirm={async () => {
            await new Promise((resolve) => {
              setTimeout(async () => {
                await Promise.all([
                  window.api.invoke("clear-ratchet-state"),
                  messageController.deleteTable(),
                  userController.deleteTable(),
                ]);

                await window.api.invoke("reload-window");
                resolve();
              }, 2000);
            });
          }}
        />
      }
    />
  );
};

const handleDeleteAccountSelect = ({ setDisplayPanel, setAlert }) => {
  const messageController = new MessageController();
  const userController = new UserController();

  const deleteAccount = {
    title: "Confirm Account Deletion",
    description:
      "Are you sure you want to delete your account? All your data will be permanently removed, and this action cannot be undone.",
    color: "",
  };

  const handleFormSubmit = async () => {
    const { err, res } = await deleteEntity();

    if (err || !res.success) {
      setDisplayPanel(null);

      setAlert({
        open: true,
        severity: "error",
        message: `Failed to Delete Account: ${err || res.message}`,
      });
      return;
    }

    setAlert({
      open: true,
      severity: "success",
      message: "Account Deleted Successfully.",
    });

    await Promise.all([
      await window.api.invoke("clear-ratchet-state"),
      await messageController.deleteTable(),
      await userController.deleteTable(),
    ]);

    setTimeout(async () => {
      await window.api.invoke("reload-window");
    }, 2000);
  };

  setDisplayPanel(
    <DisplayPanel
      header={"Delete Account"}
      body={
        <DialogView
          open={true}
          title={deleteAccount.title}
          description={deleteAccount.description}
          cancelText="cancel"
          confirmText="yes, delete account"
          onClose={() => setDisplayPanel(null)}
          onConfirm={async () => handleFormSubmit()}
        />
      }
    />
  );
};

export const handlePlatformSettingsSelect = ({
  actionName,
  currentActionRef,
  setDisplayPanel,
  setControlPanel,
  setAlert,
}) => {
  const settings = [
    {
      name: "Language",
      action: () => handleLanguageSelect({ setDisplayPanel }),
    },
    {
      name: "Change Password",
      action: () => handleChangePasswordSelect({ setDisplayPanel, setAlert }),
    },
    {
      name: "Log out",
      action: () => handleLogoutSelect({ setDisplayPanel }),
    },
    {
      name: "Delete Account",
      action: () => handleDeleteAccountSelect({ setDisplayPanel, setAlert }),
    },
  ];

  if (currentActionRef.current !== actionName) return;

  setControlPanel(
    <ControlPanel title="Settings" element={<ItemsList items={settings} />} />
  );
};
