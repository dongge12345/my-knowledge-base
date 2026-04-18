import { useEffect, useState } from "react";
import { Button, Card, Col, Input, Row, Space, Typography } from "antd";
import { createForm } from "@formily/core";
import { createSchemaField, FormProvider } from "@formily/react";
import { FormItem, FormLayout, Input as FormilyInput, Switch } from "@formily/antd-v5";
import { vscode } from "./vscode";

const SchemaField = createSchemaField({
  components: {
    FormItem,
    FormLayout,
    Input: FormilyInput,
    Switch
  }
});

const initialSchema = {
  type: "object",
  properties: {
    title: {
      type: "string",
      title: "标题",
      "x-decorator": "FormItem",
      "x-component": "Input"
    },
    visible: {
      type: "boolean",
      title: "是否展示",
      "x-decorator": "FormItem",
      "x-component": "Switch"
    }
  }
};

const form = createForm();

type ComponentMeta = {
  componentName: string;
  props: Array<{ name: string; type: string }>;
  methods: Array<{ name: string; params: string[] }>;
  slots: Array<{ name: string }>;
};

function parseSchema(schemaText: string): Record<string, unknown> {
  try {
    return JSON.parse(schemaText) as Record<string, unknown>;
  } catch {
    return initialSchema;
  }
}

export function App(): JSX.Element {
  const [schemaText, setSchemaText] = useState(JSON.stringify(initialSchema, null, 2));
  const [componentMeta, setComponentMeta] = useState<ComponentMeta | null>(null);

  useEffect(() => {
    vscode?.postMessage({ type: "ready" });

    const handler = (event: MessageEvent<{ type: string; payload?: ComponentMeta }>) => {
      if (event.data?.type === "component-meta" && event.data.payload) {
        setComponentMeta(event.data.payload);

        const nextSchema = {
          type: "object",
          properties: Object.fromEntries(
            event.data.payload.props.map((prop) => [
              prop.name,
              {
                type: prop.type === "boolean" ? "boolean" : "string",
                title: prop.name,
                "x-decorator": "FormItem",
                "x-component": prop.type === "boolean" ? "Switch" : "Input"
              }
            ])
          )
        };

        setSchemaText(JSON.stringify(nextSchema, null, 2));
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  return (
    <div className="page-shell">
      <header className="hero">
        <Typography.Title level={2}>Lowcode Schema Designer</Typography.Title>
        <Typography.Paragraph>
          面向低代码物料接入的可视化配置起步面板，后续可以继续扩展为完整的 Formily 设计器。
        </Typography.Paragraph>
      </header>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={10}>
          <Card title="组件元信息">
            <Space direction="vertical" size="middle" className="full-width">
              <Typography.Text strong>
                {componentMeta ? componentMeta.componentName : "等待扩展侧传入组件元信息"}
              </Typography.Text>
              <pre className="meta-box">
                {componentMeta
                  ? JSON.stringify(componentMeta, null, 2)
                  : "执行“抽取组件元信息”后再次打开此面板。"}
              </pre>
            </Space>
          </Card>
        </Col>
        <Col xs={24} lg={14}>
          <Card
            title="Schema 预览"
            extra={
              <Button onClick={() => vscode?.postMessage({ type: "schema-export", payload: schemaText })}>
                发送到扩展
              </Button>
            }
          >
            <Space direction="vertical" size="large" className="full-width">
              <Input.TextArea
                value={schemaText}
                rows={14}
                onChange={(event) => setSchemaText(event.target.value)}
              />
              <div className="preview-card">
                <FormProvider form={form}>
                  <SchemaField schema={parseSchema(schemaText)} />
                </FormProvider>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
