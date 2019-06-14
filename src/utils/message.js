import { message, Modal } from 'antd'

message.config({ duration: 2 });

export const success = (msg) => {
  message.success(msg);
}

export const error = (msg) => {
  message.error(msg);
}

export const warning = (msg) => {
  message.warning(msg);
}

export const deleteConfirm = ({ title, content, handler }) => {
  Modal.confirm({
    okType: "danger", okText: "删除", 
    title, content, onOk: handler,
  });
}

export const normalConfirm = ({ title, content, handler }) => {
  Modal.confirm({
    title, content, onOk: handler,
  });
}