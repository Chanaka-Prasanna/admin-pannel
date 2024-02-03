import { Popover, Button } from "antd";
import CustomAvatar from "../custom-avatar";
import { useGetIdentity } from "@refinedev/core";
import type { User } from "@/graphql/schema.types"; // look at from 59 minute to 1.11 minute.Here set up all the necessary things (tsconfig.json and vite.config.ts)
import { Text } from "../text";
import { SettingOutlined } from "@ant-design/icons";
import { useState } from "react";

const CurrentUser = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: user } = useGetIdentity<User>(); //In auth.ts we have this

  const content = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Text strong style={{ padding: "12px 20px" }}>
        {user?.name}
      </Text>
      <div
        style={{
          borderTop: "1px solid #d9d9d9",
          padding: "4px",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        <Button
          style={{ textAlign: "left" }}
          icon={<SettingOutlined />}
          type="text"
          block
          onClick={() => setIsOpen(true)}
        >
          Account Settings{" "}
        </Button>
      </div>
    </div>
  );

  return (
    <div>
      <Popover
        placement="bottomRight"
        trigger="click" // when shoud it open?
        overlayInnerStyle={{ padding: 0 }} // allow us to style specifc parts of the propover
        overlayStyle={{ zIndex: 999 }} // to appear on the top
        content={content}
      >
        <CustomAvatar
          name={user?.name}
          src={user?.avatarUrl}
          size={"default"}
          style={{ cursor: "pointer" }}
        />
      </Popover>
      {user && <AccountSettings />}
    </div>
  );
};

export default CurrentUser;
