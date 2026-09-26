"""
Builds the final Sparism logo lockup assets from:
  - assets/logo-new/sparkle-mark.png (dark ink, transparent bg)
  - assets/logo-new/sparkle-mark-white.png (white ink, transparent bg)
  - assets/fonts/Italiana-Regular.ttf (wordmark)
  - assets/fonts/Jost-Regular.ttf (tagline)

Outputs into assets/logo-new/:
  - lockup-primary.png       cream bg, plum ink+mark   (site header, packaging)
  - lockup-reversed.png      plum bg, white ink+mark   (dark surfaces, social)
  - lockup-print-black.png   white bg, solid black     (small-size label print)
  - icon-mark.png            mark only, transparent    (favicon / avatar source)
"""

from PIL import Image, ImageDraw, ImageFont

INK_PLUM = (82, 14, 39)
INK_BLACK = (20, 16, 15)
CREAM = (250, 241, 230)
PLUM_BG = (74, 37, 69)
WHITE = (255, 255, 255)
TAGLINE_ON_CREAM = (95, 60, 88)
TAGLINE_ON_PLUM = (231, 217, 201)

FONT_DIR = "D:/Hustle/Sparism/website/assets/fonts/"
MARK_DIR = "D:/Hustle/Sparism/website/assets/logo-new/"

CANVAS = 1600


def tracked_text_size(draw, text, font, tracking):
    total = 0
    heights = []
    for ch in text:
        bbox = draw.textbbox((0, 0), ch, font=font)
        total += (bbox[2] - bbox[0]) + tracking
        heights.append(bbox[3] - bbox[1])
    return total - tracking, max(heights) if heights else 0


def draw_tracked_text(draw, xy, text, font, fill, tracking):
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=font, fill=fill)
        bbox = draw.textbbox((0, 0), ch, font=font)
        x += (bbox[2] - bbox[0]) + tracking
    return x


def recolor(img, rgb):
    img = img.convert("RGBA")
    r, g, b, a = img.split()
    solid = Image.new("RGBA", img.size, rgb + (0,))
    solid.putalpha(a)
    return solid


def build_lockup(bg_color, mark_path, mark_rgb, word_rgb, tag_rgb, out_path, tag_letter_spacing=14):
    canvas = Image.new("RGB", (CANVAS, CANVAS), bg_color)
    draw = ImageDraw.Draw(canvas)

    # --- mark ---
    mark = Image.open(mark_path).convert("RGBA")
    mark = recolor(mark, mark_rgb)
    mark_w = int(CANVAS * 0.19)
    ratio = mark_w / mark.width
    mark = mark.resize((mark_w, int(mark.height * ratio)), Image.LANCZOS)

    # --- wordmark ---
    word_font = ImageFont.truetype(FONT_DIR + "Italiana-Regular.ttf", int(CANVAS * 0.135))
    word_text = "SPARISM"
    word_tracking = int(CANVAS * 0.028)
    word_w, word_h = tracked_text_size(draw, word_text, word_font, word_tracking)

    # --- tagline ---
    tag_font = ImageFont.truetype(FONT_DIR + "Jost-Regular.ttf", int(CANVAS * 0.021))
    tag_text = "FEEL YOUR SKIN'S RHYTHM"
    tag_tracking = tag_letter_spacing * (CANVAS // 1600)
    tag_w, tag_h = tracked_text_size(draw, tag_text, tag_font, tag_tracking)

    gap_mark_word = int(CANVAS * 0.02)
    gap_word_tag = int(CANVAS * 0.045)

    block_h = mark.height + gap_mark_word + word_h + gap_word_tag + tag_h
    top = (CANVAS - block_h) // 2

    mark_x = (CANVAS - mark.width) // 2
    canvas.paste(mark, (mark_x, top), mark)

    word_y = top + mark.height + gap_mark_word
    word_x = (CANVAS - word_w) // 2
    draw_tracked_text(draw, (word_x, word_y), word_text, word_font, word_rgb, word_tracking)

    tag_y = word_y + word_h + gap_word_tag
    tag_x = (CANVAS - tag_w) // 2
    draw_tracked_text(draw, (tag_x, tag_y), tag_text, tag_font, tag_rgb, tag_tracking)

    canvas.save(out_path)
    print("saved", out_path, canvas.size)


# 1. Primary — cream bg, plum ink + mark
build_lockup(
    CREAM, MARK_DIR + "sparkle-mark.png", INK_PLUM, INK_PLUM, TAGLINE_ON_CREAM,
    MARK_DIR + "lockup-primary.png",
)

# 2. Reversed — plum bg, white ink + mark
build_lockup(
    PLUM_BG, MARK_DIR + "sparkle-mark-white.png", WHITE, WHITE, TAGLINE_ON_PLUM,
    MARK_DIR + "lockup-reversed.png",
)

# 3. Print / single color — white bg, solid black
build_lockup(
    WHITE, MARK_DIR + "sparkle-mark.png", INK_BLACK, INK_BLACK, INK_BLACK,
    MARK_DIR + "lockup-print-black.png",
)

# 4. Icon-only mark, transparent bg, plum ink (for favicon/avatar source)
icon = Image.open(MARK_DIR + "sparkle-mark.png").convert("RGBA")
icon = recolor(icon, INK_PLUM)
side = max(icon.size)
pad = int(side * 0.18)
square = Image.new("RGBA", (side + pad * 2, side + pad * 2), (0, 0, 0, 0))
square.paste(icon, (pad + (side - icon.width) // 2, pad + (side - icon.height) // 2), icon)
square.save(MARK_DIR + "icon-mark.png")
print("saved", MARK_DIR + "icon-mark.png", square.size)
