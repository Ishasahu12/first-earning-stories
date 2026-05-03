-- Migration: Initial Schema
-- Date: 2024-05-03

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Stories table
CREATE TABLE IF NOT EXISTS stories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    character_name TEXT NOT NULL,
    category TEXT NOT NULL,
    year INTEGER,
    story_text TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    emotion TEXT,
    views INTEGER DEFAULT 0,
    image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert default categories
INSERT OR IGNORE INTO categories (name, display_name) VALUES
    ('student', 'Student'),
    ('freelance', 'Freelance'),
    ('business', 'Business'),
    ('tech', 'Tech'),
    ('creative', 'Creative'),
    ('skilled_work', 'Skilled Work'),
    ('teaching', 'Teaching'),
    ('vendor', 'Vendor'),
    ('physical_work', 'Physical Work');

-- Insert sample stories
INSERT INTO stories (character_name, category, year, story_text, excerpt, emotion, views) VALUES
    ('The Beginner', 'student', 2019, 
     'I still remember holding that ₹500 in my hand. It was from a small design project I did for a local shop. The note was crumpled, handed to me with a smile. I kept it in my wallet for months.

I was 19, studying in college, and money was always tight. That project took me three days of back-and-forth, learning as I went. When I finally delivered, the shop owner looked at my work, nodded, and pulled out a worn ₹500 note.

It wasn''t about the amount. It was the first time someone paid me for something I created. That feeling—of being valued for your work—never really leaves you.',
     'I still remember holding that ₹500 in my hand. It was from a small design project I did for a local shop.',
     'proud', 128),
    
    ('Quiet Teacher', 'teaching', 2020,
     'It wasn''t much, but it mattered more than I expected. My first tutoring session—I charged ₹100 an hour and felt guilty about it. The mother paid me with exact change and thanked me twice.

I spent the whole week preparing that lesson. Printed worksheets, made flashcards, rehearsed explanations in front of a mirror. When the session ended and the child actually understood the math problem, something clicked.

That ₹100 sat in my drawer for weeks. I couldn''t spend it. It felt like proof that I could be useful, that knowledge could translate into something tangible.',
     'It wasn''t much, but it mattered more than I expected. My first tutoring session—I charged ₹100 an hour and felt guilty about it.',
     'confusing', 94),
    
    ('Paper Soul', 'creative', 2018,
     'That first earning changed something I didn''t know was waiting to change. I sold handmade bookmarks at a college fest. Made ₹350 total. Lost money on materials. But someone came back the next day to buy more.

I had stayed up three nights cutting paper, drawing tiny illustrations, laminating each piece. My fingers were stained with ink. By the end of the first day, I had sold six bookmarks. Six.

Then she came back—a girl who bought one bookmark the day before. She wanted three more, for her friends. She said they loved the little cat illustration. That''s when I realized: it wasn''t about the money. It was about making something someone else wanted to keep.',
     'That first earning changed something I didn''t know was waiting to change. I sold handmade bookmarks at a college fest.',
     'proud', 203),
    
    ('Rain Rider', 'physical_work', 2021,
     'I didn''t expect it to feel like that. Delivering groceries on a bicycle in the rain. ₹40 per delivery. By evening, ₹280 soaked into my pocket and I felt like I had climbed a mountain.

The app said it would be easy. Flexible hours, be your own boss. Nobody mentioned the flooded streets, the broken address pins, the customers who wouldn''t answer their door.

But there was this one delivery—to an old woman on the fourth floor of a building with no elevator. She insisted I come in, dried my raincoat with a towel, and gave me a banana. I cried in the stairwell after. Not from sadness. From something I still can''t name.',
     'I didn''t expect it to feel like that. Delivering groceries on a bicycle in the rain. ₹40 per delivery.',
     'tough', 167),
    
    ('Accidental Tech', 'tech', 2020,
     'My uncle gave me ₹2000 to set up his shop''s Facebook page. I had no idea what I was doing. Watched YouTube tutorials for two days. He thought I was a genius. I was just desperate not to disappoint.

The page went live on a Tuesday. Five likes—all family. My uncle called me that evening, excited because someone had messaged asking about prices. Someone. One person.

I spent the next month managing that page for free, just to learn. By the end of summer, I had three more clients. All from one nervous uncle who believed in me before I believed in myself.',
     'My uncle gave me ₹2000 to set up his shop''s Facebook page. I had no idea what I was doing.',
     'unexpected', 89);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_stories_category ON stories(category);
CREATE INDEX IF NOT EXISTS idx_stories_created ON stories(created_at DESC);
