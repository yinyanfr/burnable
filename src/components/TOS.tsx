import { useLocalStorageState } from "ahooks";
import { Alert, Button, Space } from "antd";
import type { FC } from "react";
import { useId } from "react";
import { useIntl } from "umi";

const TOS: FC = () => {
  const id = useId();
  const intl = useIntl();
  const [accepted, setAccepted] = useLocalStorageState<boolean>("accepted", {
    defaultValue: false,
  });

  if (accepted) return null;

  return (
    <article>
      <Alert
        message={intl.formatMessage({ id: "tos.title" })}
        description={
          <div>
            {[
              "anonymous",
              "open",
              "storage",
              "cookie",
              "js",
              "warranty",
              "confirm",
            ].map((e) => (
              <p key={`${id}-tos-${e}`}>
                {intl.formatMessage({ id: `tos.${e}` })}
              </p>
            ))}
            <Space>
              <Button
                type="primary"
                onClick={() => {
                  setAccepted(true);
                }}
              >
                {intl.formatMessage({ id: "action.accept" })}
              </Button>
              <Button
                type="default"
                onClick={() => {
                  if (
                    window.confirm(intl.formatMessage({ id: "tos.decline" }))
                  ) {
                    window.close();
                  }
                }}
              >
                {intl.formatMessage({ id: "action.decline" })}
              </Button>
            </Space>
          </div>
        }
        type="info"
        showIcon
      />
    </article>
  );
};

export default TOS;
