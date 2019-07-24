var Story = require('../api/stories/stories.model');
var User = require('../api/users/users.model');
var Event = require('../api/events/events.model');

const photos = [
    '35c371dbf07103840159c22cbb48da8ceb5fe928.jpg',
    '5d1fbe8aea22b90024344ada51a0d9ea2a3c2d75.jpg',
    '59407c920bea9630751c91068676f130e803189f.jpg',
    'b68b466977b197416b257e489b391483aa2734aa.jpg',
    '95457c4815edb6fb8ae1ef3e1a6f6717e7cf92e6.jpg',
    'c8875cc705addf0e8ab0ed02f771a12891d7d017.jpg',
    'e0609b4d1bfe136c0ffa120510062a672605001f.jpg',
    'a5d0896d3ff9f183d477f9a0eaa4942e2ae0b083.jpg',
    '2c71613ef7c7eeb175a728448110119602ccb560.jpeg'];

module.exports = {
    createDummyData: function () {

        var zain = new User({
            username: 'zain',
            email: 'zbaig95@gmail.com',
            password: 'password',
            photo: '2c6d0bad03283f75780ca364f6e9433dc2591d5c.jpg'
        });

        var boris = new User({
            username: 'Boris Johnson',
            email: 'borisjohnson@gmail.com',
            password: 'password',
            photo: '6a170ff22911f393b4de848d6bdd89e1d826381d.jpg'
        });

        var will = new User({
            username: 'Will Ferrell',
            email: 'willferell@gmail.com',
            password: 'password',
            photo: '66b2fec06855a78facc3ca61e2846fcf4e0bb38e.jpg'
        });

        var event1 = new Event({
            title: 'Clubland on the beach 3.0',
            date: '2019-07-26T00:00:00.000Z',
            photo: '24b744c2a97f547ff8287caf6cb7600352025514.jpg',
            location: {
                address: 'Majuba Road, Redcar, Redcar and Cleveland, North East England, England, TS10 1DB, United Kingdom',
                x: -1.0814256,
                y: 54.619336,
                city: 'Redcar',
                country: 'United Kingdom'
            },
            creator: boris
        });

        var event2 = new Event({
            title: 'Inner City Live 2019',
            date: '2019-07-28T00:00:00.000Z',
            photo: '5d1fbe8aea22b90024344ada51a0d9ea2a3c2d75.jpg',
            location: {
                address: 'Perry Park, M6, Handsworth Wood, Birmingham, West Midlands Combined Authority, West Midlands, England, B44 8BW, United Kingdom',
                x: -1.90160599405769,
                y: 52.52962215,
                city: 'Birmingham',
                country: 'United Kingdom'
            },
            creator: will
        });

        var event3 = new Event({
            title: 'Playground Festival 2019',
            date: '2019-08-02T00:00:00.000Z',
            photo: 'a5d0896d3ff9f183d477f9a0eaa4942e2ae0b083.jpg',
            location: {
                address: 'Rouken Glen Park, Woodfarm, Patterton/Capelrig, East Renfrewshire, Scotland, United Kingdom',
                x: -4.31590551006681,
                y: 55.79524455,
                city: 'Glasgow',
                country: 'United Kingdom'
            },
            creator: boris
        });

        var event4 = new Event({
            title: 'Parklife 2020',
            date: '2020-06-13T00:00:00.000Z',
            photo: '2c71613ef7c7eeb175a728448110119602ccb560.jpeg',
            location: {
                address: 'Heaton Park, Crumpsall, Manchester, Greater Manchester, North West England, England, M25 2SW, United Kingdom',
                x: -2.2515288,
                y: 53.5372325,
                city: 'Manchester',
                country: 'United Kingdom'
            },
            creator: zain
        });

        let story1 = new Story({
            tldr: "This was the best event ever!",
            text: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.",
            event: event1,
            photos: selectRandomPhotos(),
            creator: zain
        });

        let story2 = new Story({
            tldr: 'Couldn\'t believe my eyes.',
            text: 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don\'t look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn\'t anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.',
            event: event3,
            photos: selectRandomPhotos(),
            creator: boris
        });

        let story3 = new Story({
            tldr: 'Absolutely stellar performance.',
            text: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English.',
            event: event4,
            photos: selectRandomPhotos(),
            creator: boris
        });

        let story4 = new Story({
            tldr: 'Michael Jackson was the best.',
            text: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English.',
            event: event3,
            photos: selectRandomPhotos(),
            creator: zain
        });

        let story5 = new Story({
            tldr: "It rained a lot but still good.",
            text: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.",
            event: event1,
            photos: selectRandomPhotos(),
            creator: will
        });

        let story6 = new Story({
            tldr: 'Hated it this time round :(',
            text: 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don\'t look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn\'t anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.',
            event: event3,
            photos: selectRandomPhotos(),
            creator: will
        });

        let story7 = new Story({
            tldr: 'Wow, had a great time!',
            text: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English.',
            event: event4,
            photos: selectRandomPhotos(),
            creator: boris
        });

        let story8 = new Story({
            tldr: 'Was not impressed to be honest.',
            text: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English.',
            event: event3,
            photos: selectRandomPhotos(),
            creator: zain
        });

        Promise.all([User.deleteMany({}), Event.deleteMany({}), Story.deleteMany({})]).then(function (values) {
            console.log("\nDB :: Clearing database\n");
            console.log(values);

            Promise.all([zain.save(), boris.save(), will.save()]).then(function (userValues) {
                console.log("\nDB :: Creating dummy users\n");
                console.log(userValues);

                Promise.all([event1.save(), event2.save(), event3.save(), event4.save()]).then(function (eventValues) {
                    console.log("\nDB :: Creating dummy events\n");
                    console.log(eventValues)

                    Promise.all([story1.save(), story2.save(), story3.save(), story4.save(), story5.save(),
                        story6.save(), story7.save(), story8.save()]).then(function (storyValues) {
                        console.log("\nDB :: Creating dummy stories\n");
                        console.log(storyValues)

                    });
                });

            })
        })

    }
};

function selectRandomPhotos() {
    let maximum = 7;
    let minimum = 1;

    var numPhotos = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;

    // Shuffle array
    const shuffled = photos.sort(() => 0.5 - Math.random());

    // Get sub-array of first n elements after shuffled
    return shuffled.slice(0, numPhotos);
}