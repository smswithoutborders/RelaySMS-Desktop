import { Launch } from "@mui/icons-material";
import { DisplayPanel, ServiceList, ItemsList } from "../Components";
import ThemeToggle from "../Components/ThemeToggle";
import { PasswordForm, OTPForm } from "../Forms";
import { DialogView, SettingView } from "../Views";
import {
  fetchPlatforms,
  listEntityStoredTokens,
  updateEntityPassword,
  deleteEntity,
  addOAuth2Token,
  deleteOAuth2Token,
  addPNBAToken,
  deletePNBAToken,
  UserController,
  MessageController,
} from "../controllers";
import LanguageList from "../Components/LanguageList";

export const executeSelect = async ({
  actionName,
  selectFunction,
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
    setDisplayPanel,
    setAlert,
  });

  if (currentActionRef.current === actionName) {
    currentActionRef.current = null;
  }
};

const handleOAuth2Platform = async ({
  platform,
  identifier,
  setAlert,
  setDisplayPanel,
  currentActionRef,
  actionName,
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

    executeSelect({
      actionName: "Platforms",
      selectFunction: handlePlatformSelect,
      setDisplayPanel,
      setAlert,
      currentActionRef,
    });
    return;
  }

  setDisplayPanel(
    <DialogView
      open={true}
      title={`Revoke Access`}
      description={`You are about to revoke access for this account. This will permanently remove access to this account from this app. You will need to reauthorize the app to regain access in the future. Are you sure you want to proceed?`}
      cancelText="Cancel"
      confirmText="Yes, Revoke Access"
      onClose={() => {
        executeSelect({
          actionName: actionName,
          selectFunction: handlePlatformSelect,
          setDisplayPanel,
          setAlert,
          currentActionRef,
        });
        return;
      }}
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

        executeSelect({
          actionName: "Platforms",
          selectFunction: handlePlatformSelect,
          setDisplayPanel,
          setAlert,
          currentActionRef,
        });
        return;
      }}
    />
  );
};

const handlePNBAAuthWithPassword = async ({
  platform,
  prevData,
  setAlert,
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
    <SettingView>
      <OTPForm
        description={details.description}
        fields={details.fields}
        twoStepVerificationEnabled={true}
        onSubmit={handleFormSubmit}
      />
    </SettingView>
  );
};

const handlePNBAAuth = async ({
  platform,
  prevData,
  setAlert,
  setDisplayPanel,
  currentActionRef,
  actionName,
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
    <DialogView
      open={true}
      title="Store Telegram Token"
      cancelText="Cancel"
      onClose={() => {
        executeSelect({
          actionName: actionName,
          selectFunction: handlePlatformSelect,
          setDisplayPanel,
          setAlert,
          currentActionRef,
        });
        return;
      }}
      content={
        <SettingView>
          <OTPForm
            description={details.description}
            fields={details.fields}
            onSubmit={handleFormSubmit}
          />{" "}
        </SettingView>
      }
    />
  );
};

const handlePNBAPlatform = async ({
  platform,
  identifier,
  setAlert,
  setDisplayPanel,
  currentActionRef,
  actionName,
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
      <DialogView
        open={true}
        title="Store Telegram Token"
        cancelText="Cancel"
        onClose={() => {
          executeSelect({
            actionName: actionName,
            selectFunction: handlePlatformSelect,
            setDisplayPanel,
            setAlert,
            currentActionRef,
          });
          return;
        }}
        content={
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
      description={`you are about to revoke access for this account. this will permanently remove access to this account from this app. you will need to reauthorize the app to regain access in the future. are you sure you want to proceed?`}
      cancelText="Cancel"
      confirmText="Yes, Revoke Access"
      onClose={() => {
        executeSelect({
          actionName: actionName,
          selectFunction: handlePlatformSelect,
          setDisplayPanel,
          setAlert,
          currentActionRef,
        });
        return;
      }}
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
  actionName,
  setDisplayPanel,
  currentActionRef,
}) => {
  try {
    if (platform.protocol_type === "oauth2") {
      await handleOAuth2Platform({
        platform,
        identifier,
        setAlert,
        actionName,
        setDisplayPanel,
        currentActionRef,
      });
    } else if (platform.protocol_type === "pnba") {
      await handlePNBAPlatform({
        platform,
        identifier,
        setAlert,
        actionName,
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
  setDisplayPanel,
  setAlert,
}) => {
  setDisplayPanel(
    <DisplayPanel
      body={<ServiceList serviceType="Platform" loading={true} />}
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

    setDisplayPanel(
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
            setDisplayPanel,
            currentActionRef,
          })
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

const handleChangePasswordSelect = ({
  setDisplayPanel,
  actionName,
  currentActionRef,
  setAlert,
}) => {
  const messageController = new MessageController();
  const userController = new UserController();

  const changePassword = {
    title: "Change Password Confirmation",
    description:
      "Are you sure you want to change your password? You will need to log in again with your new password. This action cannot be undone.",
    color: "",
  };

  const handleFormSubmit = async (data) => {
    handleChangePasswordSelect({
      setDisplayPanel,
      actionName,
      currentActionRef,
      setAlert,
    });

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
    <DialogView
      open={true}
      title="Change Password"
      cancelText="cancel"
      onClose={() => {
        executeSelect({
          actionName: actionName,
          selectFunction: handlePlatformSettingsSelect,
          setDisplayPanel,
          setAlert,
          currentActionRef,
        });
        return;
      }}
      content={
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
                  onClose={() => {
                    handleChangePasswordSelect({
                      setDisplayPanel,
                      actionName,
                      currentActionRef,
                      setAlert,
                    });
                    return;
                  }}
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

const handleLogoutSelect = ({
  setDisplayPanel,
  actionName,
  currentActionRef,
  setAlert,
}) => {
  const messageController = new MessageController();
  const userController = new UserController();

  const logout = {
    title: "Confirm Logout",
    description:
      "Are you sure you want to log out? You will need to log in again to continue using the app. This action cannot be undone.",
    color: "",
  };

  setDisplayPanel(
    <DialogView
      open={true}
      title={logout.title}
      description={logout.description}
      cancelText="cancel"
      confirmText="logout"
      onClose={() => {
        executeSelect({
          actionName: actionName,
          selectFunction: handlePlatformSettingsSelect,
          setDisplayPanel,
          setAlert,
          currentActionRef,
        });
        return;
      }}
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
  );
};

const handleDeleteAccountSelect = ({
  setDisplayPanel,
  setAlert,
  actionName,
  currentActionRef,
}) => {
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
    <DialogView
      open={true}
      title={deleteAccount.title}
      description={deleteAccount.description}
      cancelText="cancel"
      confirmText="yes, delete account"
      onClose={() => {
        executeSelect({
          actionName: actionName,
          selectFunction: handlePlatformSettingsSelect,
          setDisplayPanel,
          setAlert,
          currentActionRef,
        });
        return;
      }}
      onConfirm={async () => handleFormSubmit()}
    />
  );
};

export const handlePlatformSettingsSelect = ({
  actionName,
  currentActionRef,
  setDisplayPanel,
  setAlert,
}) => {
  const settings = [
    {
      name: "Change Password",
      action: () =>
        handleChangePasswordSelect({
          setDisplayPanel,
          actionName,
          currentActionRef,
          setAlert,
        }),
    },
    {
      name: "Log out",
      action: () =>
        handleLogoutSelect({
          setDisplayPanel,
          setAlert,
          actionName,
          currentActionRef,
        }),
    },
    {
      name: "Delete Account",
      action: () =>
        handleDeleteAccountSelect({
          setDisplayPanel,
          setAlert,
          actionName,
          currentActionRef,
        }),
    },
  ];

  if (currentActionRef.current !== actionName) return;

  setDisplayPanel(
    <DisplayPanel
      header="Settings"
      body={
        <>
          <LanguageList /> <ItemsList items={settings} /> <ThemeToggle />
        </>
      }
    />
  );
};

export const handlePlatformHelpSelect = ({
  actionName,
  currentActionRef,
  setDisplayPanel,
  setAlert,
}) => {
  const handleOpenExternalLink = (url) => {
    window.api.send("open-external-link", url);
  };

  const help = [
    {
      name: "Website",
      action: () =>
        handleOpenExternalLink("https://relay.smswithoutborders.com"),
      icon: <Launch />,
    },
    {
      name: "GitHub",
      action: () =>
        handleOpenExternalLink("https://github.com/smswithoutborders"),
      icon: <Launch />,
    },
    {
      name: "X (Twitter)",
      action: () => handleOpenExternalLink("https://x.com/RelaySMS"),
      icon: <Launch />,
    },
    {
      name: "Documentation",
      action: () =>
        handleOpenExternalLink("https://docs.smswithoutborders.com"),
      icon: <Launch />,
    },
    {
      name: "Blog",
      action: () =>
        handleOpenExternalLink("https://blog.smswithoutborders.com"),
      icon: <Launch />,
    },
  ];

  if (currentActionRef.current !== actionName) return;

  setDisplayPanel(
    <DisplayPanel header="Help" body={<ItemsList items={help} />} />
  );
};
