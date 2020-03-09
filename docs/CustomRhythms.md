# Easy-Add Rhythms
The Rhythm Trainer app allows owners to add new levels and/or rhythm blocks that can be used in rhythm mixes.

## Levels
Levels are groups of Rhythm Blocks that are grouped together. Users can select from this group to generate a new mix passage in the app. Levels can include the blocks of other levels using Sub-Levels. 

### Sub-Levels
Levels can be nested into one another using the Sub-Levels Feature. If Levels 1 and 2 are included as Sub-Levels for Level 3, then Level 3 will display all of the Level 1 and 2 blocks as well as its own Level 3 blocks. 

### Level Attributes
The following attributes must be included for a level to be valid

Attribute | Details | Accepted Values
----------|---------|----------------
Name | The name by which the level will be identified to the user. It is best kept very short. | Any string (max 4 chars)
Description | A longer description of the level so that the owner can more readily identify the level. | Any string
Measure Beats | The number of beats in each measure of the level | Any positive integer (max 16)
Quaver | The divisor of the note that should receive the pulse (i.e. 4 = quarter note) | 1, 2, 4, 8, 16
Sub Levels | A comma-separated list of sub-level names that should be included with this level | A comma-separated list of other valid level names
Active | A flag that will toggle whether this level is shown to users | TRUE or FALSE

*Note*: Levels that include invalid data will not be drawn or available to the user. 


## Rhythm Blocks
Rhythm Blocks are small rhythmic pieces that will be used to generate a randomized rhythmic passage (a "mix"). All Rhythm Blocks must be linked to a valid Level in order to be seen and selected for inclusion in a mix by the user. 


Attribute | Details | Accepted Values
----------|---------|----------------
Level | The level in which this block should be shown and included | Any valid Level name
Rhythm Set | Synonym for "Difficulty". The difficulty level in which this block should be automatically included | A, B, C, D, E, F, (For rests: A-R, B-R, C-R, D-R, E-R, F-R)
Note String | A series of characters that is used to draw the rhythm shown to the users (maximum one full measure of note value) | Any valid note string (see below).

*Note*: Rhythm Blocks that include invalid data will not be drawn or available to the user. 

### Note Strings
The Rhythm Trainer wraps the Vexflow Notation library and creates an intuitive language for creating rhythmic notation using simple strings. The valid characters are included below:

Character | Notation
----------|---------
w | Whole note
W | Whole rest
h | Half note
H | Half rest
q | Quarter note
Q | Quarter rest
e | Eighth note
E | Eighth rest
s | Sixteenth note
S | Sixteenth rest
. | Add dot to previous note (limit 1/note)


#### Example
So, to create a rhythm block of 2 sixteenths followed by an eigtht note you would write:
`sse`

Or a quarter note rest and a dotted half note:
`Qh.`

