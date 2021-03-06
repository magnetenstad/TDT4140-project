const express = require('express');
const {Database} = require('./db.js');

const PORT = 3001;
const server = express();
let db = new Database(
  process.argv[2] === 'test' ? ':memory:' : './data/database.db');


server.use(express.json());
server.use(express.urlencoded({extended: true}));

// API tests: client/cypress/integration/api.test.js

server.get('/api/get-users', (request,
    result) => {
  result.send(JSON.stringify(db.getUsers()));
});

server.delete('/api/debug/clear', (request, result) => {
  db = new Database(
    process.argv[2] === 'test' ? ':memory:' : './data/database.db');
  result.send('OK');
});

server.put('/api/get-user', (request,
    result) => {
  result.send(JSON.stringify(db.getUser(request.body.username)));
});

server.put('/api/insert-user', (request, result) => {
  if (!db.tryLogin(request.body.username, request.body.password) &&
      validInformation(request.body.username, request.body.password,
          request.body.age, request.body.email)) {
    db.insertUser(request.body.username,
        request.body.password, request.body.age,
        request.body.email, request.body.gender);
    result.send('OK');
  } else {
    const errorData = alertErrors(registrationErrors);
    result.status(400);
    console.log(errorData);
    result.send(JSON.stringify(errorData.error));
    clearErrors(registrationErrors);
  }
});

server.put('/api/try-login', (request, result) => {
  if (db.tryLogin(request.body.username, request.body.password)) {
    result.send('OK');
  } else {
    result.status(400).send();
  }
});

server.put('/api/insert-group', (request, result) => {
  if (validGroupName(request.body.name)) {
    db.insertGroup(request.body.groupId, request.body.name,
        request.body.admin, request.body.description, request.body.membership,
        request.body.location, request.body.image);
    db.addUserToGroup(request.body.groupId, request.body.admin);
    if (request.body.interests) {
      request.body.interests.forEach((interest) => {
        db.addGroupInterest(request.body.groupId, interest);
      });
    }
    result.send('OK');
  } else {
    const errorData = alertErrors(registrationErrors);
    result.status(400);
    console.log(errorData);
    result.send(JSON.stringify(errorData.error));
    clearErrors(registrationErrors);
  }
});

server.put('/api/get-group', (request, result) => {
  result.send(JSON.stringify(db.getGroup(request.body.groupId)));
});

server.put('/api/get-groups-with-user', (request, result) => {
  result.send(JSON.stringify(db.getGroupsWithUser(request.body.username)));
});

server.get('/api/get-groups', (request, result) => {
  result.send(JSON.stringify(db.getGroups()));
});

server.get('/api/get-users', (request, result) => {
  result.send(JSON.stringify(db.getUsers()));
});

server.put('/api/add-user-to-group', (request, result) => {
  db.addUserToGroup(request.body.groupId, request.body.username);
  result.send('OK');
});

server.put('/api/get-group-interests', (request, result) => {
  result.send(JSON.stringify(db.getGroupInterests(request.body.groupId)));
});

server.put('/api/get-group-members', (request, result) => {
  result.send(JSON.stringify(db.getGroupMembers(request.body.groupId)));
});


server.put('/api/get-group-membership', (request, result) => {
  result.send(JSON.stringify(db.getGroupMembership(request.body.groupId)));
});


server.put('/api/insert-group-interest', (request, result) => {
  db.addGroupInterest(request.body.groupId, request.body.interest);
  result.send('OK');
});

server.put('/api/delete-group-interest', (request, result) => {
  db.deleteGroupInterest(request.body.groupId, request.body.interest);
  result.send('OK');
});

server.put('/api/match-groups', (request, result) => {
  db.matchGroups(request.body.primaryId, request.body.secondaryId
      , request.body.isSuperLike);
  result.send('OK');
});

server.put('/api/get-group-matches', (request, result) => {
  result.send(JSON.stringify(db.getGroupMatches(request.body.groupId)));
});

server.put('/api/get-group-superlikes', (request, result) => {
  result.send(JSON.stringify(db.getSuperLikes(request.body.groupId)));
});

server.put('/api/downgrade-superlike', (request, result) => {
  db.downgradeSuperlike(request.body.primaryId, request.body.secondaryId);
  result.send('OK');
});

server.put('/api/get-incomplete-group-matches', (request, result) => {
  result.send(
      JSON.stringify(db.getIncompleteGroupMatches(request.body.groupId)));
});

server.put('/api/get-invitations-with-user', (request, result) => {
  result.send(JSON.stringify(db.getUserInvitations(request.body.username)));
});

server.put('/api/invite-user-to-group', (request, result) => {
  db.inviteUserToGroup(request.body.username, request.body.groupId);
  result.send('OK');
});

server.put('/api/answer-invite', (request, result) => {
  db.answerGroupInvitation(request.body.username, request.body.accept
      , request.body.groupId);
  result.send('OK');
});

server.put('/api/get-group-invitations', (request, result) => {
  result.send(JSON.stringify(db.getGroupInvitations(request.body.groupId)));
});

server.put('/api/update-group-attributes', (request, result) => {
  db.updateGroupAttributes(request.body.groupId, request.body.name,
      request.body.description, request.body.location, request.body.image);

  const interests = db.getGroupInterests(request.body.groupId);
  interests.forEach((interest)=> {
    db.deleteGroupInterest(request.body.groupId, interest.interest);
  });

  if (request.body.interests) {
    request.body.interests.forEach((interest) => {
      db.addGroupInterest(request.body.groupId, interest);
    });
  }
  result.send('OK');
});

server.put('/api/get-all-groups', (request, result) => {
  result.send(JSON.stringify(db.getAllGroups()));
});

server.put('/api/get-groups-with-interest', (request, result) => {
  result.send(JSON.stringify(db.getGroupWithInterest(request)));
});

server.put('/api/filter-groups', (request, result) => {
  result.send(
      JSON.stringify(filterGroups(request.body)));
});

server.get('/api/locations', (request, result) => {
  const locations = db.getLocations().map((e) => e.location);
  result.send(JSON.stringify(locations));
});

server.get('/api/interests', (request, result) => {
  const interests = db.getInterests().map((e) => e.interest);
  result.send(JSON.stringify(interests));
});

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

const registrationErrors = [];

/**
 * Validates user input.
 * @param {String} username:
 * @param {String} password:
 * @param {String} age:
 * @param {String} email:
 * @return {boolean} if the input is valid.
 */
function validInformation(username, password, age, email) {
  // Iterates over functions to get potential errors
  validUsername(username);
  validPassword(password);
  validAge(age);
  validEmail(email);
  return registrationErrors.length === 0;
}

/**
 * Validates username.
 * @param {String} username:
 * @return {boolean} if username is valid or not.
 */
function validUsername(username) {
  const regexPattern = /[A-Za-z]+$/i; // Regex only letters
  if (regexPattern.test(username)) {
    return true;
  } else {
    registrationErrors.push('Username must only containt letters');
  }
}

/**
 * Validates password.
 * @param {String} password:
 * @return {boolean} if password is valid or not.
 */
function validPassword(password) {
  if (password.length >= 6) {
    return true;
  } else {
    registrationErrors.push('Password must be atleast 6 characters long');
    return false;
  }
}
/**
 * Validates groupName.
 * @param {String} groupName:
 * @return {boolean} if groupName is valid or not.
 */
function validGroupName(groupName) {
  const regexPattern = /[A-Za-z]+$/i;
  if (regexPattern.test(groupName)) {
    return true;
  } else {
    registrationErrors.push('GroupName must only contain letters');
    return false;
  }
}
/**
 * Validates age.
 * @param {String} age:
 * @return {boolean} if age is valid or not.
 */
function validAge(age) {
  if (parseInt(age) >= 18 && parseInt(age) <= 99) {
    return true;
  } else {
    registrationErrors.push('You need to be between 18 and 99 years old.');
    return false;
  }
}

/**
 * Validates email.
 * @param {String} email:
 * @return {boolean} if email is valid or not.
 */
function validEmail(email) {
  // Splits on @, checks for two substrings
  const substrings = email.split('@');
  if (substrings.length === 2) {
    if ((substrings[0].length > 1) && (substrings[1].length > 1)) {
      // Splits on . Checks for two substrings
      const domainsubstring = substrings[1].split('.');
      if (domainsubstring.length === 2) {
        if (domainsubstring[0].length > 1 && domainsubstring[1].length > 1) {
          return true;
        } else {
          registrationErrors.push('Must be a valid email! xx@yy.zz');
          return false;
        }
      } else {
        registrationErrors.push('Must be a valid email! xx@yy.zz');
        return false;
      }
    } else {
      registrationErrors.push('Must be a valid email! xx@yy.zz');
      return false;
    }
  } else {
    registrationErrors.push('Must be a valid email! xx@yy.zz');
    return false;
  }
}

/**
 * returns a list of errors.
 // eslint-disable-next-line valid-jsdoc
 * @param registrationErrors
 * @return {{error: *}}
 */
function alertErrors(registrationErrors) {
  if (registrationErrors.length !== 0) {
    const output = registrationErrors.join('\r\n');
    return {
      error: output,
    };
  }
}

/**
 * Simply clears the errors.
 * @param {*[]} registrationErrors: list to be cleared.
 * @return {null}
 */
function clearErrors(registrationErrors) {
  registrationErrors.length = 0;
  return null;
}

/**
 * Filters groups based on data.
 // eslint-disable-next-line valid-jsdoc
 * @param data
 * @return {*} a new array
 */
function filterGroups(data) {
  const arrays = [db.getAllGroups()];

  if (data.interests !== undefined) {
    data.interests.forEach((interest) => {
      arrays.push(db.getGroupWithInterest(interest));
    });
  }
  if (data.locations !== undefined && data.locations.length) {
    const locations = [];
    data.locations.forEach((location) => {
      db.getGroupsAtLocation(location).forEach((group) => {
        locations.push(group);
      });
    });
    arrays.push(locations);
  }
  if (data.ageRange !== undefined && data.ageRange.length) {
    arrays.push(db.getGroupsOfAge(data.ageRange[0], data.ageRange[1]));
  }
  if (data.sizeRange !== undefined && data.sizeRange.length) {
    arrays.push(db.getGroupsOfSize(data.sizeRange[0], data.sizeRange[1]));
  }

  return arrays.reduce(
      (a, b) => a.filter((c) => b.some((d) => d.groupId === c.groupId)),
  );
}
