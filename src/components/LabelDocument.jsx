import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import { contain } from "three/src/extras/TextureUtils.js";

const styles = StyleSheet.create({
  page: {
    padding: "0.3in",
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  divider: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#cccccc",
    marginVertical: 8,
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionBlock: {
    flexDirection: "column",
    justifyContent: "center",
  },
  sectionLabel: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1,
    marginBottom: 4,
    color: "#888888",
  },
  text: {
    fontSize: 10,
    marginBottom: 2,
    color: "#1a1a1a",
  },
  boldText: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    marginBottom: 3,
    color: "#1a1a1a",
  },
  orderNumber: {
    fontSize: 9,
    color: "#888888",
    marginBottom: 2,
  },
  logo: {
    width: 60,
    height: 45,
    objectFit: "contain",
  },
  fragile: {
    width: 55,
    height: 55,
    objectFit: "contain",
  },
  notesBlock: {
    flexDirection: "column",
    justifyContent: "center",
  },
  barcode: {
    width: 120,
    height: 40,
    objectFit: "contain",
  },
  barcodeWrapper: {
    marginTop: 60,
    opacity: 0.2,
    alignItems: "center",
  },
});

function LabelDocument({ selectedClient, selectedItem, orderId, date }) {
  const address2 = selectedClient?.address_2 || null;

  return (
    <Document>
      <Page size={[288, 432]} style={styles.page}>
        {/* ORDER DETAILS */}
        <View style={styles.sectionRow}>
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionLabel}>ORDER DETAILS</Text>
            <Text style={styles.orderNumber}>Order #: {orderId ?? "—"}</Text>
            <Text style={styles.text}>Item: {selectedItem?.item ?? "—"}</Text>
            <Text style={styles.text}>Date: {date}</Text>
          </View>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Image style={styles.logo} src="soynikon-logo.png" />
          </View>
        </View>

        <View style={styles.divider} />

        {/* SHIP TO */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionLabel}>SHIP TO</Text>
          <Text style={styles.boldText}>
            {selectedClient?.first_name} {selectedClient?.last_name}
          </Text>
          <Text style={styles.text}>{selectedClient?.address_1}</Text>
          {address2 && <Text style={styles.text}>{address2}</Text>}
          <Text style={styles.text}>
            {selectedClient?.city}, {selectedClient?.state}{" "}
            {selectedClient?.zip}
          </Text>
        </View>

        <View style={styles.divider} />

        {/* FROM */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionLabel}>FROM</Text>
          <Text style={styles.text}>Soynikon Photo Store</Text>
          <Text style={styles.text}>5th Ave</Text>
          <Text style={styles.text}>New York, NY 10001</Text>
        </View>

        <View style={styles.divider} />

        {/* NOTES */}
        <View style={styles.sectionRow}>
          <View style={styles.notesBlock}>
            <Text style={styles.sectionLabel}>NOTES</Text>
          </View>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Image style={styles.fragile} src="fragile.png" />
          </View>
        </View>
        <View style={styles.barcodeWrapper}>
          <Image style={styles.barcode} src="barcode.png" />
        </View>
      </Page>
    </Document>
  );
}

export default LabelDocument;
