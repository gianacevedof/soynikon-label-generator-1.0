import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import {
  LOGO_DATA_URI,
  FRAGILE_DATA_URI,
  BARCODE_DATA_URI,
} from "../utils/labelImages";

// These mirror my custom css palette by value so the printed label stays
// visually in sync with the on-screen preview in Labels.jsx. Update both
// places if the palette changes.
const colors = {
  surface: "#ffffff", // matches --surface
  dark: "#1a1a1a", // matches --dark
  grayMuted: "#6e6e73", // matches --gray-muted
  dividerGray: "#cccccc", // intentionally darker than --gray-border (#e4e4e7) —
};

const styles = StyleSheet.create({
  page: {
    padding: "0.3in",
    fontFamily: "Helvetica",
    backgroundColor: colors.surface,
  },
  divider: {
    borderBottomWidth: 0.5,
    borderBottomColor: colors.dividerGray,
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
    color: colors.grayMuted,
  },
  text: {
    fontSize: 10,
    marginBottom: 2,
    color: colors.dark,
  },
  boldText: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    marginBottom: 3,
    color: colors.dark,
  },
  orderNumber: {
    fontSize: 9,
    color: colors.grayMuted,
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

// Renders the actual downloadable PDF label — a mirror of the live
// preview markup in Labels.jsx built from @react-pdf/renderer
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
            <Image style={styles.logo} src={LOGO_DATA_URI} />
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
            <Image style={styles.fragile} src={FRAGILE_DATA_URI} />
          </View>
        </View>
        <View style={styles.barcodeWrapper}>
          <Image style={styles.barcode} src={BARCODE_DATA_URI} />
        </View>
      </Page>
    </Document>
  );
}

export default LabelDocument;
