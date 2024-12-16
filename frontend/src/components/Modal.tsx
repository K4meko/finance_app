// src/components/LogoutModal.tsx
import {Button, Flex, Group, Modal} from "@mantine/core";

interface LogoutModalProps {
  opened: boolean;
  onClose: () => void;
}

export function LogoutModal({opened, onClose}: LogoutModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title='Confirm Logout'
      centered
      styles={{
        title: {
          fontWeight: 600,
        },
        body: {
          padding: "var(--mantine-spacing-md)",
        },
        overlay: {},
        inner: {
          zIndex: "var(--mantine-z-index-modal)",
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          margin: 0,
          padding: 0,
          "--app-shell-navbar-offset": "0",
          "--app-shell-navbar-width": "0",
          "--modal-x-offset": "0",
          "--modal-y-offset": "0",
        },
        content: {
          margin: 0,
          transform: "none",
          position: "relative",
        },
      }}
    >
      <Flex direction='column' gap='md'>
        <p>Are you sure you want to logout?</p>
        <Group justify='flex-end'>
          <Button variant='light' onClick={onClose}>
            Cancel
          </Button>
          <Button
            color='red'
            onClick={() => {
              localStorage.removeItem("token");
              onClose();
              window.location.href = "/";
            }}
          >
            Confirm
          </Button>
        </Group>
      </Flex>
    </Modal>
  );
}
