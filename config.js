/* =====================================================================
   WEDDING DETAILS — edit this file only.
   Everything on the site is filled from here.
   ===================================================================== */
window.INVITE_CONFIG = {
  groom: { name: "Ayan", parents: "S/o Mrs. Rahin and Mr. Raees Abdulgani Qudsi" },
  bride: { name: "Fatima", parents: "D/o Mrs. Gulafroz and Mr. Ashfaque Ahmed Sayyed (Naeem)" },

  memorial: "Late Amanpasha and Abdulgani Qudsi",
  invitationLine: "We kindly request the honour of your presence at the Wedding Ceremony of their beloved grandson",
  tagline: "Celebrating Love and Happiness",
  from: "Raees Abdulgani Qudsi",
  presentNote: "Your presence is the only present desired.",
  familyMessage: "With love & duas, from Raees Abdulgani Qudsi",

  // {groom} and {bride} are replaced automatically
  story: "In the Name of Almighty Allah, the most Merciful and most Kind — we are honoured to welcome you to the Nikah of {groom} & {bride}, as they begin their journey together in faith and love.",

  // Personal links: add ?to=Name to the link (e.g. …/?to=Khan%20Family) and the envelope says "To, Khan Family".

  // events[0] is the Nikah, events[1] is the Reception.
  events: [
    {
      id: "nikah", name: "Nikah", art: "mosque",
      day: "Saturday", date: "19th December 2026", hijri: "10th Rajab 1448 Hijri",
      time: "After Namaz-e-Asar",
      venue: "Kausar Baugh Masjid",
      address: "Kausar Baugh, Kondhwa, Pune 411048",
      // exact pin (Google place "Masjid-e-Kausar", Plus Code FVFV+53X)
      lat: 18.47299, lng: 73.89273, placeId: "ChIJPVIcGGPqwjsRrKNTG7yD_PE",
      dress: "", colour: "", colourHex: "",            // optional — leave empty to hide
      start: "2026-12-19T16:30:00+05:30", end: "2026-12-19T18:30:00+05:30"
    },
    {
      id: "reception", name: "Reception", art: "reception",
      day: "Monday", date: "21st December 2026", hijri: "12th Rajab 1448 Hijri",
      time: "Dinner at 7:30 PM onwards",
      venue: "Jehangir Baugh Lawns",
      address: "Opp. Kaka Halwai, Fatima Nagar, Wanowrie, Pune 411013",
      // exact pin (Google place "Jehangir Baugh Wedding Lawns")
      lat: 18.505472, lng: 73.900939, placeId: "ChIJB2QPH8bBwjsR23Iw5hxl8zs",
      dress: "", colour: "", colourHex: "",
      start: "2026-12-21T19:30:00+05:30", end: "2026-12-21T23:00:00+05:30"
    }
  ],

  // the countdown counts down to the Reception
  countdownTo: "2026-12-21T19:30:00+05:30",
  countdownLabel: "Counting down to the Reception",

  music: {
    file: "",           // to use your own song: add song.mp3 next to index.html and set this to "song.mp3"
    softSong: true,     // otherwise the built-in soft piano piece plays (false = no music)
    youtube: ""         // optional: a YouTube link shows an "Our Song" button instead
  }
};
