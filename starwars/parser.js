const fs = require('fs');
const exec = require('child_process').execSync;
 

const queries = [];

for(let index = 2; index < 29; index++) {
  if (!fs.existsSync(`page${index}.html`)) {
    exec(`curl https://brickset.com/sets/theme-Star-Wars/page-${index} > ./page${index}.html`)
  } else {
    console.log(`File for "page${index}.html" is already downloaded`);
  }
}

for(let index = 1; index < 29; index++) {
  const contents = fs.readFileSync(`page${index}.html`, 'utf8');
  const sets = contents.match(/(<article class='set'>.*?<\/article>)/gmis);
  sets.forEach(set => {
    try {
      const year = set.match(/<a class='year'.*?>(.*?)<\/a>/)[1];
      let availability = set.match(/<dt>Availability<\/dt><dd>(.*?)<\/dd>/s);
      let genre = set.match(/<div class='tags'>.*?<a class='subtheme'.*?>(.*?)<\/a>.*?<\/div>/s);
      if (genre === null) {
        let genre = 'unknown'
        console.log('null', genre);
      } else {
        genre = genre[1]
      }
      const data = set.match(/(.*?<img.*?>)/);
      const href = data[1].match(/src="(.*?)"/)[1];
      const titleHtml = data[1].match(/title="(.*?)"/);
      const setDetails = titleHtml[1].split(': ');
      availability = availability === null ? 'unknown' : availability[1];
      let imageUrl = `/images/starWars/${setDetails[0]}.jpg`;

      if (href.match(/blankbox/)) {
        imageUrl = '/images/starWars/blankbox.gif';
      } else {
        const imagePath = `../app/images/starWars/${setDetails[0]}.jpg`;

        if (!fs.existsSync(imagePath)) {
          exec(`curl ${href} > ../app/images/starWars/${setDetails[0]}.jpg`)
        } else {
          console.log(`Image for set "${setDetails[0]}" is already downloaded`);
        }
      }
      /*
      console.log(genre);
      console.log(year);
      console.log(href);
      console.log(setDetails[0]);
      console.log(setDetails[1]);
      */
      queries.push(
        `INSERT INTO starWarsSets (setId, description, genre, year, image, availability) VALUES (
          "${setDetails[0]}",
          "${setDetails[1]}",
          "${genre}",
          "${year}",
          "${imageUrl}",
          "${availability}"
          )
        ;`
      );
  } catch(error) {
    console.log(set);
    console.log(error);
  }
  });
}

//console.log(queries);

fs.writeFile("queries.txt", queries.join('\n'), function(err) {
  if(err) {
      return console.log(err);
  }

  console.log("The file was saved!");
}); 
