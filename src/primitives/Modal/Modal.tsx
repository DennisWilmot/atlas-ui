import { Overlay } from "../Overlay";
import type { OverlayProps } from "../Overlay";

export type ModalProps = Omit<OverlayProps, "mode">;

export function Modal(props: ModalProps) {
  return <Overlay {...props} mode="modal" />;
}
