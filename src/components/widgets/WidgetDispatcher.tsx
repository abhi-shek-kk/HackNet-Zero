"use client";

import React from "react";
import { EnvelopeJourneyWidget } from "./EnvelopeJourneyWidget";
import { PortDoorKnocker } from "./PortDoorKnocker";
import { ArpTricksterWidget } from "./ArpTricksterWidget";
import { FirewallFilterGame } from "./FirewallFilterGame";
import { PacketInspectorWidget } from "./PacketInspectorWidget";
import { LocalNetworkWidget } from "./LocalNetworkWidget";
import { PortScannerWidget } from "./PortScannerWidget";
import { TcpHandshakeWidget } from "./TcpHandshakeWidget";
import { DnsArpMitmWidget } from "./DnsArpMitmWidget";
import { FirewallTunnelWidget } from "./FirewallTunnelWidget";

export type WidgetType =
  | "envelope-journey"
  | "port-door-knocker"
  | "arp-trickster"
  | "firewall-filter-game"
  | "packet-inspector"
  | "local-network"
  | "port-scanner"
  | "tcp-handshake"
  | "dns-arp-mitm"
  | "firewall-tunnel";

interface WidgetDispatcherProps {
  widgetType: WidgetType;
  config?: Record<string, any>;
}

export function WidgetDispatcher({ widgetType, config }: WidgetDispatcherProps) {
  switch (widgetType) {
    case "envelope-journey":
      return <EnvelopeJourneyWidget />;
    case "port-door-knocker":
      return <PortDoorKnocker />;
    case "arp-trickster":
      return <ArpTricksterWidget />;
    case "firewall-filter-game":
      return <FirewallFilterGame />;
    case "packet-inspector":
      return <PacketInspectorWidget config={config} />;
    case "local-network":
      return <LocalNetworkWidget config={config} />;
    case "port-scanner":
      return <PortScannerWidget config={config} />;
    case "tcp-handshake":
      return <TcpHandshakeWidget config={config} />;
    case "dns-arp-mitm":
      return <DnsArpMitmWidget config={config} />;
    case "firewall-tunnel":
      return <FirewallTunnelWidget config={config} />;
    default:
      return null;
  }
}
