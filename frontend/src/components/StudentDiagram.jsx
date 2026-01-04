import { useEffect, useMemo, useState } from "react";
import { getAdkProgress, setAdkItem } from "../api";

/**
 * itemKey-Format: "section.item"
 * Muss URL-sicher sein -> wir encoden beim API call.
 */
const ADK_STRUCTURE = [
  {
    key: "grundstufe",
    title: "Grundstufe",
    items: [
      { key: "besonderheiten_einsteigen", label: "Besonderheiten beim Einsteigen" },

      // Einstellen (Leafs)
      { key: "einstellen_sitz", label: "Einstellen: Sitz" },
      { key: "einstellen_spiegel", label: "Einstellen: Spiegel" },
      { key: "einstellen_lenkrad", label: "Einstellen: Lenkrad" },
      { key: "einstellen_kopfstuetze", label: "Einstellen: Kopfstütze" },

      { key: "lenkradhaltung", label: "Lenkradhaltung" },
      { key: "pedale", label: "Pedale" },
      { key: "gurt_anlegen_anpassen", label: "Gurt anlegen/anpassen" },
      { key: "schalt_waehlhebel", label: "Schalt-/Wählhebel" },
      { key: "zuendschloss", label: "Zündschloss" },
      { key: "motor_anlassen", label: "Motor anlassen" },

      { key: "anfahr_anhalteuebungen", label: "Anfahr- und Anhalteübungen" },

      // Schaltübungen (umweltschonend)
      { key: "schaltuebungen_hoch", label: "Schaltübungen (umweltschonend): Hoch 1-2 2-3 3-4 4-5 5-6" },
      { key: "schaltuebungen_runter_6_1", label: "Schaltübungen (umweltschonend): runter 6-5 5-4 4-3 3-2 2-1" },
      { key: "schaltuebungen_runter_mix", label: "Schaltübungen (umweltschonend): Runter 6-4 6-3 6-2 6-1 5-3 5-2 5-1 4-2 4-1 3-1" },

      { key: "lenkuebungen", label: "Lenkübungen" }
    ]
  },

  {
    key: "aufbaustufe",
    title: "Aufbaustufe",
    items: [
      { key: "rollen_und_schalten", label: "Rollen und Schalten" },
      { key: "abbremsen_und_schalten", label: "Abbremsen und Schalten" },

      // Bremsübungen
      { key: "bremsuebungen_degressiv", label: "Bremsübungen: Degressiv" },
      { key: "bremsuebungen_zielbremsung", label: "Bremsübungen: Zielbremsung" },
      { key: "bremsuebungen_gefahr", label: "Bremsübungen: Gefahrssituation" },

      // Gefälle (Leafs)
      { key: "gefaelle_anhalten", label: "Gefälle: Anhalten" },
      { key: "gefaelle_anfahren", label: "Gefälle: Anfahren" },
      { key: "gefaelle_rueckwaerts", label: "Gefälle: Rückwärts" },
      { key: "gefaelle_sichern", label: "Gefälle: Sichern" },
      { key: "gefaelle_schalten", label: "Gefälle: Schalten" },

      // Steigung (Leafs)
      { key: "steigung_anhalten", label: "Steigung: Anhalten" },
      { key: "steigung_anfahren", label: "Steigung: Anfahren" },
      { key: "steigung_rueckwaerts", label: "Steigung: Rückwärts" },
      { key: "steigung_sichern", label: "Steigung: Sichern" },
      { key: "steigung_schalten", label: "Steigung: Schalten" },

      { key: "tastgeschwindigkeit", label: "Tastgeschwindigkeit" },
      { key: "bedienung_kontrolleinrichtungen", label: "Bedienungs- + Kontrolleinrichtungen" },
      { key: "oertliche_besonderheiten", label: "Örtliche Besonderheiten" },
      { key: "oertliche_besonderheiten_textfeld", label: "(Textfeld in Einstellungen)" }
    ]
  },

  {
    key: "leistungsstufe",
    title: "Leistungsstufe",
    items: [
      // Fahrbahnbenutzung
      { key: "fahrbahnbenutzung", label: "Fahrbahnbenutzung" },
      { key: "fahrbahnbenutzung_einordnen", label: "Fahrbahnbenutzung: Einordnen" },
      { key: "fahrbahnbenutzung_markierungen", label: "Fahrbahnbenutzung: Markierungen" },

      // Fahrstreifenwechsel
      { key: "fahrstreifenwechsel", label: "Fahrstreifenwechsel" },
      { key: "fahrstreifenwechsel_links", label: "Fahrstreifenwechsel: links" },
      { key: "fahrstreifenwechsel_rechts", label: "Fahrstreifenwechsel: rechts" },

      { key: "vorbeifahren_ueberholen", label: "Vorbeifahren/Überholen" },

      // Abbiegen
      { key: "abbiegen", label: "Abbiegen" },
      { key: "abbiegen_rechts", label: "Abbiegen: Rechts" },
      { key: "abbiegen_links", label: "Abbiegen: Links" },
      { key: "mehrspurig", label: "Mehrspurig" },
      { key: "radweg", label: "Radweg" },
      { key: "strassenbahnen", label: "Straßenbahnen" },
      { key: "sonderstreifen", label: "Sonderstreifen" },
      { key: "einbahnstrassen", label: "Einbahnstraßen" },

      // Vorfahrt
      { key: "vorfahrt", label: "Vorfahrt" },
      { key: "vorfahrt_zeichen", label: "Vorfahrtgebende/nehmende Zeichen" },
      { key: "vorfahrt_rechts_vor_links", label: "Vorfahrt: rechts vor links" },
      { key: "vorfahrt_gruenpfeilampel", label: "Vorfahrt: Grünpfeilampel" },
      { key: "vorfahrt_polizeibeamte", label: "Vorfahrt: Polizeibeamte" },
      { key: "vorfahrt_gruenpfeilschild", label: "Vorfahrt: Grünpfeilschild" },
      { key: "vorfahrt_abknickende_strasse", label: "Vorfahrt: Abknickende Vorfahrtstraße" },
      { key: "vorfahrt_halt_gewaehren", label: "Vorfahrt: Halt, Vorfahrt gewähren" },
      { key: "vorfahrt_abknickend", label: "Vorfahrt: Abknickende Vorfahrt" },

      { key: "geschwindigkeit", label: "Geschwindigkeit" },
      { key: "abstand", label: "Abstand" },

      // Situation mit anderen Verkehrsteilnehmern
      { key: "andere_verkehrsteilnehmer", label: "Situation mit anderen Verkehrsteilnehmern" },
      { key: "andere_fussgaengerueberwege", label: "… Fußgängerüberwege" },
      { key: "andere_kinder", label: "… Kinder" },
      { key: "andere_schulbus", label: "… Schulbus" },
      { key: "andere_oepnv", label: "… ÖPNV" },
      { key: "andere_aeltere_behinderte", label: "… Ältere/Behinderte" },
      { key: "andere_radfahrer_mofa", label: "… Radfahrer/Mofa" },
      { key: "andere_einbahn_radfahrer", label: "… Einbahnstr. Radfahrer" },
      { key: "andere_verkehrsberuhigt", label: "… Verkehrsberuhigter Bereich" },

      // Schwierige Verkehrsführung
      { key: "schwierige_verkehrsfuehrung", label: "Schwierige Verkehrsführung" },
      { key: "schwierige_engpass", label: "… Engpass" },
      { key: "schwierige_kreisverkehr", label: "… Kreisverkehr" },
      { key: "schwierige_bahnuebergang_warten", label: "… Bahnübergang (Warten)" },

      // Kritische Verkehrssituationen
      { key: "kritische_verkehrssituationen", label: "Kritische Verkehrssituationen" },
      { key: "kritische_hauptverkehrszeiten", label: "… Hauptverkehrszeiten" },

      { key: "partnerschaftliches_verhalten", label: "Partnerschaftliches Verhalten (Kommunikation, Verzicht auf Vorfahrt)" },
      { key: "schwung_nutzen", label: "Schwung nutzen" },
      { key: "fussgaenger_schutzbereich", label: "Fußgänger Schutzbereich" }
    ]
  },

  {
    key: "besondere_ausbildungsfahrten",
    title: "Besondere Ausbildungsfahrten",
    items: [
      // Überlandfahrten
      { key: "ueberland_angepasste_geschwindigkeit", label: "Überlandfahrten: Angepasste Geschwindigkeit/gangwahl (Alle Gänge)" },
      { key: "ueberland_abstand", label: "Überlandfahrten: Abstand" },
      { key: "ueberland_abstand_vorne", label: "… vorne" },
      { key: "ueberland_abstand_hinten", label: "… hinten" },
      { key: "ueberland_abstand_seitlich", label: "… seitlich" },
      { key: "ueberland_beobachtung_spiegel", label: "Überlandfahrten: Beobachtung/Spiegel" },
      { key: "ueberland_verkehrszeichen", label: "Überlandfahrten: Verkehrszeichen" },
      { key: "ueberland_kreuzungen_einmuendungen", label: "Überlandfahrten: Kreuzungen/Einmündungen" },
      { key: "ueberland_kurven", label: "Überlandfahrten: Kurven" },
      { key: "ueberland_steigungen", label: "Überlandfahrten: Steigungen" },
      { key: "ueberland_gefaelle", label: "Überlandfahrten: Gefälle" },
      { key: "ueberland_alleen", label: "Überlandfahrten: Alleen" },
      { key: "ueberland_ueberholen", label: "Überlandfahrten: Überholen" },
      { key: "ueberland_besondere_situationen", label: "Überlandfahrten: Besondere Situationen" },
      { key: "ueberland_liegenbleiben_absichern", label: "… Liegenbleiben und Absichern" },
      { key: "ueberland_fussgaenger", label: "… Fußgänger" },
      { key: "ueberland_einfahrten_ortschaften", label: "… Einfahrten in Ortschaften" },
      { key: "ueberland_wild_tiere", label: "… Wild/Tiere" },
      { key: "ueberland_besondere_anforderungen", label: "Überlandfahrten: Besondere Anforderungen" },
      { key: "ueberland_leistungsgrenze", label: "… Leistungsgrenze" },
      { key: "ueberland_ablenkung_radio", label: "… Ablenkung (z.B. Radio)" },
      { key: "ueberland_orientierung", label: "… Orientierung" },

      // Autobahn
      { key: "autobahn_fahrtplanung", label: "Autobahn: Fahrtplanung" },
      { key: "autobahn_einfahren_bab", label: "Autobahn: Einfahren in BAB" },
      { key: "autobahn_fahrstreifenwahl", label: "Autobahn: Fahrstreifenwahl" },
      { key: "autobahn_geschwindigkeit", label: "Autobahn: Geschwindigkeit" },
      { key: "autobahn_abstand", label: "Autobahn: Abstand" },
      { key: "autobahn_abstand_vorne", label: "… vorne" },
      { key: "autobahn_abstand_hinten", label: "… hinten" },
      { key: "autobahn_abstand_seitlich", label: "… seitlich" },
      { key: "autobahn_ueberholen", label: "Autobahn: Überholen" },
      { key: "autobahn_schilder_markierungen", label: "Autobahn: Schilder/Markierungen" },
      { key: "autobahn_vorbeifahren_anschlussstellen", label: "Autobahn: Vorbeifahren/Anschlussstellen" },
      { key: "autobahn_rast_park_tankstellen", label: "Autobahn: Rast-/Parkplätze, Tankstellen" },
      { key: "autobahn_verhalten_unfaellen", label: "Autobahn: Verhalten bei Unfällen" },
      { key: "autobahn_dichter_verkehr_stau", label: "Autobahn: Dichter Verkehr/Stau" },
      { key: "autobahn_besondere_anforderungen", label: "Autobahn: Besondere Anforderungen" },
      { key: "autobahn_leistungsgrenze", label: "… Leistungsgrenze" },
      { key: "autobahn_ablenkung", label: "… Ablenkung" },
      { key: "autobahn_konfliktsituationen", label: "… Konfliktsituationen" },
      { key: "autobahn_verlassen_bab", label: "Autobahn: Verlassen der BAB" },

      // Dunkelheit
      { key: "dunkelheit_beleuchtung", label: "Dunkelheit: Beleuchtung" },
      { key: "dunkelheit_kontrolle", label: "… Kontrolle" },
      { key: "dunkelheit_benutzung", label: "… Benutzung" },
      { key: "dunkelheit_einstellen", label: "… Einstellen" },
      { key: "dunkelheit_fernlicht", label: "… Fernlicht" },
      { key: "dunkelheit_beleuchtete_strassen", label: "Dunkelheit: Beleuchtete Straßen" },
      { key: "dunkelheit_unbeleuchtete_strassen", label: "Dunkelheit: Unbeleuchtete Straßen" },
      { key: "dunkelheit_parken", label: "Dunkelheit: Parken" },
      { key: "dunkelheit_besondere_situationen", label: "Dunkelheit: Besondere Situationen" },
      { key: "dunkelheit_schlechte_witterung", label: "… Schlechte Witterung" },
      { key: "dunkelheit_bahnuebergaenge", label: "… Bahnübergänge" },
      { key: "dunkelheit_tiere", label: "… Tiere" },
      { key: "dunkelheit_unbeleuchtete_teilnehmer", label: "… Unbeleuchtete Verkehrsteilnehmer" },
      { key: "dunkelheit_besondere_anforderungen", label: "Dunkelheit: Besondere Anforderungen" },
      { key: "dunkelheit_blendung", label: "… Blendung" },
      { key: "dunkelheit_orientierung", label: "… Orientierung" },
      { key: "dunkelheit_abschlussbesprechung", label: "… Abschlussbesprechung" }
    ]
  },

  {
    key: "situative_bausteine",
    title: "Situative Bausteine – Checkliste zur fahrtechnischen Vorbereitung",
    items: [
      // Beim Fahrzeug
      { key: "fahrzeug_reifen", label: "Beim Fahrzeug: Reifen (z.B. Beschädigungen, Profiltiefe, Reifendruck)" },
      { key: "fahrzeug_scheinwerfer_leuchten_blinker_hupe", label: "Beim Fahrzeug: Scheinwerfer, Leuchten, Blinker, Hupe" },
      { key: "fahrzeug_ein_aus_schalten", label: "… Ein- und Ausschalten" },
      { key: "fahrzeug_funktion_pruefen", label: "… Funktion prüfen" },
      { key: "fahrzeug_standlicht", label: "… Standlicht" },
      { key: "fahrzeug_abblendlicht", label: "… Abblendlicht" },
      { key: "fahrzeug_fernlicht", label: "… Fernlicht" },
      { key: "fahrzeug_schlussleuchten_kennzeichen", label: "… Schlussleuchten mit Kennzeichenbeleuchtung" },
      { key: "fahrzeug_nebelschlussleuchte", label: "… Nebelschlussleuchte" },
      { key: "fahrzeug_warnblinkanlage", label: "… Warnblinkanlage" },
      { key: "fahrzeug_blinker", label: "… Blinker" },
      { key: "fahrzeug_hupe", label: "… Hupe" },
      { key: "fahrzeug_bremsleuchte", label: "… Bremsleuchte" },
      { key: "fahrzeug_kontrollleuchte_benennen", label: "Beim Fahrzeug: Kontrollleuchte benennen" },
      { key: "fahrzeug_rueckstrahler", label: "Beim Fahrzeug: Rückstrahler" },
      { key: "fahrzeug_rueckstrahler_vorhandensein", label: "… Vorhandensein" },
      { key: "fahrzeug_rueckstrahler_beschaedigung", label: "… Beschädigung" },
      { key: "fahrzeug_lenkung", label: "Beim Fahrzeug: Lenkung" },
      { key: "fahrzeug_lenkschloss_entriegeln", label: "… Lenkschloss entriegeln" },
      { key: "fahrzeug_lenkspiel_pruefen", label: "… Überprüfung des Lenkspiels" },
      { key: "fahrzeug_bremsen_funktionspruefung", label: "Beim Fahrzeug: Funktionsprüfung der Bremsen" },
      { key: "fahrzeug_betriebsbremse", label: "… Betriebsbremse" },
      { key: "fahrzeug_feststellbremse", label: "… Feststellbremse" },

      // Beim Fahrer
      { key: "fahrer_richtige_sitzeinstellung", label: "Beim Fahrer (vor Fahrtbeginn): Richtige Sitzeinstellung" },
      { key: "fahrer_rueckspiegel_einstellung", label: "… Einstellung der Rückspiegel" },
      { key: "fahrer_kopfstuetze", label: "… der Kopfstütze" },
      { key: "fahrer_lenkrad", label: "… des Lenkrads" },
      { key: "fahrer_sicherheitsgurt", label: "… Anlegen des Sicherheitsgurts" },

      // Heizung und Lüftung
      { key: "heizung_lueftung_bedienen", label: "Heizung und Lüftung: Bedienen der Aggregate" },
      { key: "heizung", label: "… Heizung" },
      { key: "lueftung", label: "… Lüftung" },
      { key: "klimaanlage", label: "… Klimaanlage" },
      { key: "heckscheibenheizung", label: "… Heckscheibenheizung" },
      { key: "beheizte_sonderausstattungen", label: "… Beheizte Sonderausstattungen" },
      { key: "energiesparende_nutzung", label: "Heizung und Lüftung: Energiesparende Nutzung" },
      { key: "keine_unnoetigen_verbraucher", label: "… keine unnötigen Verbraucher" },
      { key: "rechtzeitig_abschalten", label: "… Rechtzeitiges Abschalten" },

      // Betriebs- und Verkehrssicherheit
      { key: "betriebs_verkehrssicherheit_fluessigkeitsstaende", label: "Betriebs- und Verkehrssicherheit: Motorraum/Flüssigkeitsstände" },
      { key: "motoroel", label: "… Motoröl" },
      { key: "kuehlmittel", label: "… Kühlmittel" },
      { key: "scheibenwaschfluessigkeit", label: "… Scheibenwaschflüssigkeit" },
      { key: "tanken", label: "Betriebs- und Verkehrssicherheit: Tanken" },
      { key: "sicherungsmittel", label: "Betriebs- und Verkehrssicherheit: Sicherungsmittel" },
      { key: "warndreieck", label: "… Warndreieck" },
      { key: "verbandskasten", label: "… Verbandskasten" },
      { key: "bordwerkzeug", label: "… Bordwerkzeug" },
      { key: "zusaetzliche_ausruestung", label: "… zusätzliche Ausrüstung" },
      { key: "aussenkontrolle", label: "Betriebs- und Verkehrssicherheit: Außenkontrolle" },
      { key: "aussen_scheiben_wischer", label: "… Scheiben/Wischer" },
      { key: "aussen_spiegel", label: "… Spiegel" },
      { key: "aussen_kennzeichen_hu_au", label: "… Kennzeichen (HU/AU)" },
      { key: "aussen_beleuchtung", label: "… Beleuchtung" },
      { key: "aussen_bremsen", label: "… Bremsen" },
      { key: "aussen_ladung", label: "… Ladung" },
      { key: "aussen_ladung_sicherung", label: "…… Sicherung" },
      { key: "aussen_ladung_kenntlichmachung", label: "…… Kenntlichmachung" },

      // Witterung
      { key: "witterung_fahren_schlecht", label: "Witterung: Fahren bei schlechter Witterung" },
      { key: "witterung_lueftung", label: "… Lüftung" },
      { key: "witterung_beleuchtung", label: "… Beleuchtung" },
      { key: "witterung_wischer_wascher", label: "… Scheibenwischer/-wascher" },
      { key: "witterung_regen_spruehnebel", label: "… Regen/Sprühneben" },
      { key: "witterung_aquaplaning", label: "… Wasserlachen/Aquaplaning" },
      { key: "witterung_wind_sturm_boeen", label: "… Wind, Sturm, Böen" },
      { key: "witterung_schnee_matsch", label: "… Schnee und Matsch" },
      { key: "witterung_eis", label: "… Eis" }
    ]
  },

  {
    key: "grundfahraufgaben",
    title: "Grundfahraufgaben",
    items: [
      { key: "rueckwaertsfahren", label: "Rückwärtsfahren" },
      { key: "rueckwaerts_rechts_um_die_ecke", label: "… Rückwärts Rechts um die Ecke" },

      { key: "umkehren", label: "Umkehren" },
      { key: "umkehren_vorwaerts", label: "… Vorwärts" },
      { key: "umkehren_rueckwaerts", label: "… Rückwärts" },
      { key: "umkehren_wendehammer", label: "… Wendehammer" },

      { key: "gefahrbremsung", label: "Gefahrbremsung" },

      { key: "einparken_laengs", label: "Einparken längs" },
      { key: "einparken_laengs_vorwaerts", label: "… Vorwärts" },
      { key: "einparken_laengs_vorwaerts_links", label: "…… links" },
      { key: "einparken_laengs_vorwaerts_rechts", label: "…… Rechts" },
      { key: "einparken_laengs_rueckwaerts", label: "… Rückwärts" },
      { key: "einparken_laengs_rueckwaerts_links", label: "…… Links" },
      { key: "einparken_laengs_rueckwaerts_rechts", label: "…… Rechts" },

      { key: "einparken_quer", label: "Einparken quer" },
      { key: "einparken_quer_vorwaerts", label: "… Vorwärts" },
      { key: "einparken_quer_vorwaerts_links", label: "…… Links" },
      { key: "einparken_quer_vorwaerts_rechts", label: "…… Rechts" },
      { key: "einparken_quer_rueckwaerts", label: "… Rückwärts" },
      { key: "einparken_quer_rueckwaerts_links", label: "…… Links" },
      { key: "einparken_quer_rueckwaerts_rechts", label: "…… Rechts" }
    ]
  },

  {
    key: "reife_teststufe",
    title: "Reife- und Teststufe",
    items: [
      { key: "selbststaendiges_fahren", label: "Selbstständiges Fahren" },
      { key: "selbststaendig_innerorts", label: "… Innerorts" },
      { key: "selbststaendig_ausserorts", label: "… Außerorts" },

      { key: "verantwortungsbewusstes_fahren", label: "Verantwortungsbewusstes Fahren" },

      { key: "testfahrt_pruefungsbedingungen", label: "Testfahrt unter Prüfungsbedingungen" },
      { key: "testfahrt_fakt", label: "… FAKT" },
      { key: "testfahrt_andere", label: "… Andere" },

      { key: "wiederholung_vertiefung", label: "Wiederholung/Vertiefung" },
      { key: "leistungsbewertung", label: "Leistungsbewertung" }
    ]
  }
];

function sectionProgress(section, progress) {
  const total = section.items.length;
  const done = section.items.reduce((s, it) => {
    const k = `${section.key}.${it.key}`;
    return s + (progress[k] ? 1 : 0);
  }, 0);
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return { done, total, pct };
}

export default function StudentDiagram({ student }) {
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(false);
  const [openSections, setOpenSections] = useState(() => {
  const o = {};
  for (const s of ADK_STRUCTURE) o[s.key] = true; // alle offen
  return o;
});

function toggleSection(key) {
  setOpenSections((o) => ({ ...o, [key]: !o[key] }));
}



  useEffect(() => {
    (async () => {
      if (!student?.id) return;
      setLoading(true);
      try {
        const res = await getAdkProgress(student.id);
        setProgress(res.data || {});
      } finally {
        setLoading(false);
      }
    })();
  }, [student?.id]);

  const totals = useMemo(() => {
    let total = 0;
    let done = 0;
    for (const sec of ADK_STRUCTURE) {
      total += sec.items.length;
      for (const it of sec.items) {
        if (progress[`${sec.key}.${it.key}`]) done++;
      }
    }
    const pct = total === 0 ? 0 : Math.round((done / total) * 100);
    return { done, total, pct };
  }, [progress]);

  async function toggle(secKey, itemKey, checked) {
    if (!student?.id) return;
    const fullKey = `${secKey}.${itemKey}`;

    // Optimistisch UI
    setProgress((p) => ({ ...p, [fullKey]: checked }));

    try {
      await setAdkItem(student.id, fullKey, checked);
    } catch (e) {
      // rollback
      setProgress((p) => ({ ...p, [fullKey]: !checked }));
      alert("Speichern fehlgeschlagen.");
    }
  }

  if (!student) {
    return (
      <div className="card adkCard">
        <h2>Ausbildungsdiagrammkarte</h2>
        <p style={{ color: "#6b7280" }}>Bitte einen Schüler auswählen.</p>
      </div>
    );
  }

  return (
    <div className="card adkCard">
      <h1 style={{ marginTop: 0 }}>Ausbildungsdiagrammkarte</h1>
      <div className="adkTopMeta">{student.name}</div>

      <div className="adkTopMeta">
        Gesamt: <strong>{totals.done}/{totals.total}</strong> erledigt ·{" "}
        <strong>{totals.pct}%</strong>
        {loading ? " · lädt…" : ""}
      </div>

      <div style={{ display: "grid", gap: 16 }}>
        {ADK_STRUCTURE.map((section) => {
  const p = sectionProgress(section, progress);
  const isOpen = !!openSections[section.key];

  return (
    <div key={section.key} className="adkSection">
      {/* HEADER (klickbar) */}
      <button
        type="button"
        className="adkAccordionHeader"
        onClick={() => toggleSection(section.key)}
        aria-expanded={isOpen}
      >
        <div className="adkHeaderRow">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="adkChevron">
              {isOpen ? "▾" : "▸"}
            </span>
            <strong>{section.title}</strong>
          </div>

          <span style={{ color: "#6b7280", fontWeight: 700 }}>
            {p.done}/{p.total} · {p.pct}%
          </span>
        </div>

        <div className="adkProgressBar">
          <div
            className="adkProgressFill"
            style={{ width: `${p.pct}%` }}
          />
        </div>
      </button>

      {/* BODY (einklappbar) */}
      <div className={isOpen ? "adkSectionBody" : "adkSectionBodyHidden"}>
        <div className="adkItemsGrid">
          {section.items.map((it) => {
            const k = `${section.key}.${it.key}`;
            const checked = !!progress[k];

            return (
              <label key={k} className="adkCheckbox">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) =>
                    toggle(section.key, it.key, e.target.checked)
                  }
                  onClick={(e) => e.stopPropagation()}
                />
                <span>{it.label}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
})}

        
      </div>
    </div>
  );
}