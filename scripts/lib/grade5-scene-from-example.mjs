/** Map grade 5 number-card example sentences → visual scene hints (no numbers/text). */
export function sceneFromExample(example) {
  const e = String(example || "").toLowerCase();
  if (e.includes("greenhouse") && e.includes("pepper"))
    return "Bright greenhouse interior in spring with many rows of small green pepper seedlings in black trays on wooden benches, warm sunlight through glass panels, friendly gardener tending plants";
  if (e.includes("hikers") && e.includes("mountain safety"))
    return "Dawn mountain trailhead with friendly hikers in outdoor gear signing a wooden safety logbook at a ranger station, misty peaks in background, orange sunrise sky";
  if (e.includes("puzzle box") && e.includes("wooden tiles"))
    return "Open wooden puzzle box spilling colorful interlocking wooden tiles on a cozy table, friendly child arranging pieces, warm indoor light";
  if (e.includes("beads") && e.includes("bracelet"))
    return "Craft table with colorful beads being strung into a bracelet for a school craft auction, friendly hands crafting, jars of beads nearby";
  if (e.includes("archive") && e.includes("town council"))
    return "Town archive basement with tall stacks of labeled cardboard boxes of council meeting records, friendly archivist on ladder organizing shelves";
  if (e.includes("campers") && e.includes("badges"))
    return "Wilderness skills camp with friendly campers receiving merit badges around a campfire ring, tents and pine trees in background";
  if (e.includes("choir") && e.includes("songs"))
    return "School choir in robes holding songbooks on stage during spring tour rehearsal, warm stage lights, friendly singers";
  if (e.includes("tickets") && e.includes("planetarium"))
    return "Planetarium entrance with friendly staff handing printed tickets to excited children, dome building and starry sky mural without readable text";
  if (e.includes("mural") && e.includes("tiles"))
    return "Community wall mural with many colorful hand-painted ceramic tiles being installed by families on a sunny town square";
  if (e.includes("scouts") && e.includes("orienteering"))
    return "Scouts with compass and map completing an orienteering course in a sunny forest clearing before noon, checkpoint flags";
  if (e.includes("robotics showcase"))
    return "School gym robotics showcase with friendly students presenting colorful robots on display tables, banners without readable text";
  if (e.includes("museum catalog") && e.includes("artifacts"))
    return "Museum gallery with glass cases of ancient pottery and artifacts, friendly curator with catalog binder, warm lighting";
  if (e.includes("saplings") && e.includes("riverbank"))
    return "Volunteers planting young saplings along a sunny riverbank, watering cans and shovels, flowing blue river behind";
  if (e.includes("room") && e.includes("chemistry lab goggles"))
    return "School chemistry lab storage room with shelves of safety goggles in neat rows, beakers and lab benches visible";
  if (e.includes("lanterns") && e.includes("festival"))
    return "Cultural festival gate decorated with strings of colorful paper lanterns, festive crowd without readable signs";
  if (e.includes("orchestra") && e.includes("measures"))
    return "Orchestra on stage rehearsing with conductor, musicians with instruments, concert hall warm lighting";
  if (e.includes("families") && e.includes("literacy"))
    return "Families donating stacks of colorful books at a school literacy week booth, cheerful children and parents, book drive without readable text";
  if (e.includes("switchbacks") && e.includes("ridge"))
    return "Mountain ridge hiking trail with wooden trail markers along steep switchbacks, scenic valley view, sunny day";
  if (e.includes("relay team") && e.includes("seconds"))
    return "Track relay team crossing finish line on outdoor running track, stopwatch in coach hand without readable numbers, cheering crowd";
  if (e.includes("votes") && e.includes("student council"))
    return "Student council meeting with students raising hands to vote on budget, classroom setting, friendly diverse students";
  return "Friendly children's educational scene matching the sentence context, warm and cheerful";
}
