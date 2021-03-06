"use strict";

const Students = require("../models/students");
const AlreadyExists = require("../errors/AlreadyExists");
const NotFound = require("../errors/NotFound");
const { Op } = require("sequelize");

exports.checkIfExist = async (params, name) => {
  const result = await Students.findOne({ where: params });
  if (result) {
    throw new AlreadyExists(`${name} already exists.`);
  }
};

exports.create = async (body) => {
  await this.checkIfExist({ cpf: body.cpf }, "CPF");
  await this.checkIfExist({ ra: body.ra }, "RA");
  return await Students.create(body);
};

exports.getAll = async (perPage, page, orderBy, order, name) => {
  const where = name
    ? {
        name: {
          [Op.like]: `%${name}%`,
        },
      }
    : null;
  return await Students.findAndCountAll({
    attributes: ["id", "name", "email", "cpf", "ra", "active"],
    limit: Number(perPage) || null,
    offset: Number(page) || null,
    order: [[orderBy || "id", order || "DESC"]],
    where,
  });
};

exports.getByID = async (id) => {
  const result = await Students.findByPk(id, {
    attributes: ["id", "name", "email", "cpf", "ra", "active"],
  });
  if (!result) {
    throw new NotFound("Student not found.");
  }
  return result;
};

exports.update = async (id, body) => {
  await this.getByID(id);
  return await Students.update(body, { where: { id } });
};

exports.delete = async (id) => {
  await this.getByID(id);
  return await Students.destroy({ where: { id } });
};
